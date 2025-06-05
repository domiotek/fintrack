import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  QueryList,
  Renderer2,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatReadonlyMessageComponent } from './components/chat-readonly-message/chat-readonly-message.component';
import { ChatSystemMessageComponent } from './components/chat-system-message/chat-system-message.component';
import { ChatMessageBlockComponent } from './components/chat-message-block/chat-message-block.component';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollDropped, NgScrollReached } from 'ngx-scrollbar/reached-event';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TypingIndicatorComponent } from './components/typing-indicator/typing-indicator.component';
import { ChatMessage } from '../../../core/models/chat/message.model';
import { ChatBlock, ChatMessageBlock } from './models/chat-message-block.model';
import { ChatService } from '../../../core/services/chat/chat.service';
import {
  DEFAULT_CHAT_BOTTOM_OFFSET,
  DEFAULT_CHAT_MAX_BLOCK_TIME_DIFFERENCE,
  DEFAULT_CHAT_SCROLL_BOTTOM_DURATION,
} from './constants/chat.const';
import { AppStateStore } from '../../../core/store/app-state.store';
import { DateTime } from 'luxon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { callDebounced } from '../../../utils/debouncer';
import { User } from '../../../core/models/user/user.model';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    NgScrollbarModule,
    NgScrollReached,
    NgScrollDropped,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ChatInputComponent,
    ChatReadonlyMessageComponent,
    ChatSystemMessageComponent,
    ChatMessageBlockComponent,
    TypingIndicatorComponent,
    AvatarComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewInit {
  @ViewChild('scrollbarRef') scrollbarRef!: NgScrollbar;
  @ViewChildren('readIndicatorRef') readIndicatorRefs!: QueryList<ElementRef<HTMLDivElement>>;

  readonly chatId = input.required<string>();
  readonly readonly = input<boolean>(false);
  readonly chatParticipants = input.required<User[]>();

  readonly scrollToBottomVisible = signal<boolean>(false);
  readonly typingUsers = signal<string[]>([]);
  readonly messages = signal<ChatMessage[]>([]);
  readonly lastReadMessagesMap = signal<Record<number, string>>({});
  readonly lastUserActivityTime = signal<Record<number, DateTime>>({});
  readonly messagesWithReadIndicators = signal<Record<string, number[]>>({});
  readonly currentUserId = signal<number | null>(null);
  readonly scrollSnapMessageId = signal<string | null>(null);
  readonly loading = signal<boolean>(true);
  readonly hasMorePages = signal<boolean>(false);

  readonly myLastReadMessageId = computed(() => {
    return this.currentUserId() !== null ? this.lastReadMessagesMap()[this.currentUserId()!] : null;
  });

  readonly otherChatParticipants = computed(() => {
    return this.chatParticipants().filter((user) => user.id !== this.currentUserId());
  });

  readonly activeChatParticipants = computed(() => {
    return this.otherChatParticipants()
      .filter((user) => {
        const dateTime = this.lastUserActivityTime()[user.id];
        return dateTime?.isValid && dateTime.plus({ minutes: 5 }) > DateTime.now();
      })
      .map((user) => user.id);
  });

  readonly messageBlocks = computed(() => {
    const blocks: ChatBlock[] = [];

    let currentBlock: ChatMessageBlock | null = null;

    this.messages().forEach((message) => {
      if (message.authorType === 'system') {
        blocks.push({
          id: message.id,
          type: 'system',
          message: message.content,
        });
        currentBlock = null;
        return;
      }

      const lastMessageInCurrentBlock = currentBlock?.messages[currentBlock.messages.length - 1];
      const lastMessageSentAt = DateTime.fromISO(lastMessageInCurrentBlock?.sentAt || '');
      const currentMessageSentAt = DateTime.fromISO(message.sentAt);

      const isMessageTooLateForBlock =
        lastMessageSentAt.isValid &&
        lastMessageSentAt.plus({ minutes: DEFAULT_CHAT_MAX_BLOCK_TIME_DIFFERENCE }) < currentMessageSentAt;

      if (!currentBlock || currentBlock.userId !== message.authorId || isMessageTooLateForBlock) {
        if (isMessageTooLateForBlock || !currentBlock) {
          blocks.push({
            id: message.id,
            type: 'system',
            message: currentMessageSentAt.toFormat('dd LLL yyyy HH:mm'),
          });
        }

        const newBlock: ChatBlock = {
          type: 'user',
          userId: message.authorId!,
          name: message.authorName!,
          surname: message.authorSurname!,
          messages: [message],
          perspective: this.currentUserId() === message.authorId ? 'my' : 'their',
        };
        blocks.push(newBlock);

        currentBlock = newBlock;

        return;
      }

      currentBlock.messages.push(message);
    });

    return blocks;
  });

  readonly droppedBottomOffset = DEFAULT_CHAT_BOTTOM_OFFSET;

  private readonly chatService = inject(ChatService);
  private readonly appStateStore = inject(AppStateStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    this.appStateStore.appState$.subscribe((state) => {
      this.currentUserId.set(state.userId);
    });

    this.chatService.connectToChat(this.chatId());
    this.fetchAndMergeMessages();

    this.chatService.typingUsers$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((typingUsers) => {
      const newTypingUsers = this.chatParticipants()
        .filter((user) => typingUsers.includes(user.id) && user.id !== this.currentUserId())
        .map((user) => user.firstName);

      this.typingUsers.set(newTypingUsers);
    });

    this.chatService.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((messages) => {
      this.messages.set(messages);

      setTimeout(() => {
        this.updateReadIndicatorPositions();
        if (!this.loading() && !this.scrollToBottomVisible()) {
          this.scrollToBottom(false);
        }
      }, 0);
    });

    this.chatService.lastReadMessagesMap$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lastReadMessagesMap) => {
      this.lastReadMessagesMap.set(lastReadMessagesMap);
      this.updateReadIndicatorPositions();
    });
  }

  onSendMessage(message: string): void {
    this.chatService.sendMessage(message);
  }

  onScrolledTop() {
    if (this.loading() || !this.hasMorePages()) return;
    this.fetchAndMergeMessages();
  }

  onScrollerContentUpdate() {
    this.scrollbarRef?.scrollToElement("*[data-message-id='" + this.scrollSnapMessageId() + "']", { duration: 0 });
    this.scrollSnapMessageId.set(null);
  }

  onMessageRead = callDebounced((messageId: string) => {
    const message = this.messages().find((msg) => msg.id === messageId);
    const lastReadMessage = this.messages().find((msg) => msg.id === this.myLastReadMessageId());

    if (!message) return;

    if (lastReadMessage && DateTime.fromISO(message.sentAt) < DateTime.fromISO(lastReadMessage.sentAt)) {
      return;
    }

    this.chatService.updateLastReadMessage(messageId);
  }, 300);

  scrollToBottom(instant: boolean = false): void {
    this.scrollbarRef?.scrollTo({ bottom: 0, duration: instant ? 0 : DEFAULT_CHAT_SCROLL_BOTTOM_DURATION });
  }

  isMessageBlockFinalized(blockLastMessage: ChatMessage): boolean {
    const myLastReadMessage = this.messages().find((msg) => msg.id === this.myLastReadMessageId());

    if (!myLastReadMessage) return false;

    const blockLastMessageSentAt = DateTime.fromISO(blockLastMessage.sentAt);
    const myLastReadMessageSentAt = DateTime.fromISO(myLastReadMessage.sentAt);

    return blockLastMessageSentAt <= myLastReadMessageSentAt;
  }

  private fetchAndMergeMessages(): void {
    this.loading.set(true);
    this.scrollSnapMessageId.set(this.messages()[0]?.id || null);

    this.chatService.getNextChatMessages(this.scrollSnapMessageId()).subscribe((messagesResponse) => {
      this.hasMorePages.set(messagesResponse.page.totalPages > messagesResponse.page.number);
      this.loading.set(false);
    });
  }

  private updateReadIndicatorPositions() {
    const elementArray = this.readIndicatorRefs?.toArray();

    if (!elementArray || elementArray.length === 0) return;

    const messagesWithReadIndicatorsMap = new Map<string, number[]>();

    for (const participant of this.otherChatParticipants()) {
      const targetIndicator = elementArray.find((el) => el.nativeElement.dataset['id'] === participant.id.toString());
      const targetMessageId = this.lastReadMessagesMap()[participant.id];

      if (!targetIndicator || !targetMessageId) continue;

      this.renderer.setStyle(targetIndicator.nativeElement, 'right', '');

      const targetMessageElement = this.scrollbarRef?.nativeElement.querySelector(
        `*[data-message-id="${targetMessageId}"] .message`,
      ) as HTMLElement;

      if (targetMessageElement) {
        this.renderer.setStyle(
          targetIndicator.nativeElement,
          'top',
          `${targetMessageElement.offsetTop + targetMessageElement.clientHeight + 6}px`,
        );
      }

      const existingReadIndicators = messagesWithReadIndicatorsMap.get(targetMessageId) || [];
      existingReadIndicators.forEach((userId, index) => {
        const otherIndicator = elementArray.find((el) => el.nativeElement.dataset['id'] === userId.toString());
        this.renderer.setStyle(otherIndicator?.nativeElement, 'right', `${index * 2 + 2}em`);
      });

      if (targetMessageId) {
        messagesWithReadIndicatorsMap.set(targetMessageId, [...existingReadIndicators, participant.id]);
        this.messagesWithReadIndicators.set(Object.fromEntries(messagesWithReadIndicatorsMap));
      }
    }
  }
}
