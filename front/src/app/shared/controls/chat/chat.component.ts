import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
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
  DEFAULT_CHAT_PAGE_SIZE,
  DEFAULT_CHAT_SCROLL_BOTTOM_DURATION,
} from './constants/chat.const';
import { AppStateStore } from '../../../core/store/app-state.store';
import { DateTime } from 'luxon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollbarRef') scrollbarRef!: NgScrollbar;

  readonly chatId = input.required<string>();
  readonly readonly = input<boolean>(false);

  readonly scrollToBottomVisible = signal<boolean>(false);
  readonly typingUsers = signal<string[]>([]);
  readonly messages = signal<ChatMessage[]>([]);
  readonly lastReadMessagesMap = signal<Record<number, string>>({});
  readonly offset = signal<number>(0);
  readonly currentUserId = signal<number | null>(null);
  readonly scrollSnapMessageId = signal<string | null>(null);
  readonly loading = signal<boolean>(true);
  readonly hasMorePages = signal<boolean>(false);

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

  ngOnInit(): void {
    this.chatService.connectToChat(this.chatId()).subscribe();

    this.chatService.typingUsers$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((typingUsers) => {
      this.typingUsers.set(typingUsers.map((user) => user.name));
    });
  }

  ngAfterViewInit(): void {
    this.appStateStore.appState$.subscribe((state) => {
      this.currentUserId.set(state.userId);
    });

    this.fetchAndMergeMessages();
  }

  onLeftBottom() {
    this.scrollToBottomVisible.set(true);
  }

  onScrolledBottom() {
    this.scrollToBottomVisible.set(false);
  }

  onScrolledTop() {
    if (this.loading() || !this.hasMorePages()) return;
    this.offset.update((prev) => prev + DEFAULT_CHAT_PAGE_SIZE);
    this.fetchAndMergeMessages();
  }

  onScrollerContentUpdate() {
    this.scrollbarRef?.scrollToElement("*[data-message-id='" + this.scrollSnapMessageId() + "']", { duration: 0 });
    this.scrollSnapMessageId.set(null);
  }

  scrollToBottom(instant: boolean = false): void {
    this.scrollbarRef?.scrollTo({ bottom: 0, duration: instant ? 0 : DEFAULT_CHAT_SCROLL_BOTTOM_DURATION });
  }

  private fetchAndMergeMessages(): void {
    this.loading.set(true);
    this.scrollSnapMessageId.set(this.messages()[0]?.id || null);

    this.chatService.getChatMessages(this.offset()).subscribe((messagesResponse) => {
      this.messages.update((prevMessages) => {
        return [...messagesResponse.content, ...prevMessages];
      });
      this.hasMorePages.set(messagesResponse.page.totalPages > this.offset() / DEFAULT_CHAT_PAGE_SIZE + 1);
      this.loading.set(false);
    });
  }
}
