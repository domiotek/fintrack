import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  QueryList,
  Renderer2,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollDropped, NgScrollReached } from 'ngx-scrollbar/reached-event';
import { DEFAULT_CHAT_BOTTOM_OFFSET, DEFAULT_CHAT_SCROLL_BOTTOM_DURATION } from '../../constants/chat.const';
import { AvatarComponent } from '../../../../components/avatar/avatar.component';
import { Participant } from '../../../../../core/models/chat/chat.model';
import { DateTime } from 'luxon';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatMessage } from '../../../../../core/models/chat/message.model';
import { ChatStateStore } from '../../store/chat-state.store';
import { ChatBlocksWrapperComponent } from '../chat-blocks-wrapper/chat-blocks-wrapper.component';

@Component({
  selector: 'app-chat-messages-wrapper',
  imports: [
    CommonModule,
    NgScrollbarModule,
    NgScrollReached,
    NgScrollDropped,
    AvatarComponent,
    ChatBlocksWrapperComponent,
  ],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss',
})
export class ChatMessagesWrapperComponent implements AfterContentInit, AfterViewChecked {
  @ViewChild('scrollbarRef') scrollbarRef!: NgScrollbar;
  @ViewChildren('readIndicatorRef') readIndicatorRefs!: QueryList<ElementRef<HTMLDivElement>>;

  private readonly chatService = inject(ChatService);
  private readonly store = inject(ChatStateStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);

  readonly chatParticipants = input.required<Participant[]>();
  readonly currentUserId = input.required<number | null>();
  readonly scrollToBottomVisible = model(false);

  readonly droppedBottomOffset = DEFAULT_CHAT_BOTTOM_OFFSET;
  readonly messages = signal<ChatMessage[]>([]);
  readonly lastReadMessagesMap = signal<Record<number, number | null>>({});
  readonly lastUserActivityTime = signal<Record<number, string>>({});
  readonly messagesWithReadIndicators = signal<Record<string, number[]>>({});

  readonly scrollSnapMessageId = this.store.scrollSnapMessageId;
  readonly loading = this.store.loading;
  readonly isWindowActive = this.store.isWindowActive;

  readonly otherChatParticipants = computed(() => {
    return this.chatParticipants().filter((user) => user.id !== this.currentUserId());
  });

  readonly myLastReadMessageId = computed(() => {
    return this.currentUserId() !== null ? this.lastReadMessagesMap()[this.currentUserId()!] : null;
  });

  ngAfterContentInit(): void {
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

    this.chatService.lastUserActivityMap$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lastUserActivityMap) => {
      this.lastUserActivityTime.set(lastUserActivityMap);
    });
  }

  ngAfterViewChecked(): void {
    this.updateReadIndicatorPositions();
  }

  onScrolledTop() {
    if (this.loading() || !this.chatService.hasMorePages()) return;
    this.fetchMoreMessages();
  }

  onScrollerContentUpdate() {
    this.scrollbarRef?.scrollToElement("*[data-message-id='" + this.scrollSnapMessageId() + "']", { duration: 0 });
    this.store.setScrollSnapMessageId(null);
  }

  tryReadMessage(messageId: number): void {
    const message = this.messages().find((msg) => msg.id === messageId);
    const lastReadMessage = this.messages().find((msg) => msg.id === this.myLastReadMessageId());

    if (!message) return;

    if (lastReadMessage && DateTime.fromISO(message.sentAt) < DateTime.fromISO(lastReadMessage.sentAt)) {
      return;
    }

    this.chatService.updateLastReadMessage(messageId);
  }

  scrollToBottom(instant: boolean = false): void {
    this.scrollbarRef?.scrollTo({ bottom: 0, duration: instant ? 0 : DEFAULT_CHAT_SCROLL_BOTTOM_DURATION });
  }

  tryReadLastMessage() {
    this.tryReadMessage(this.messages()[this.messages().length - 1]?.id || 0);
  }

  private fetchMoreMessages(): void {
    this.store.setLoading(true);
    this.store.setScrollSnapMessageId(this.messages()[0]?.id || null);

    this.chatService.getNextChatMessages(this.scrollSnapMessageId()).subscribe((messagesResponse) => {
      this.store.setLoading(false);
    });
  }

  private updateReadIndicatorPositions() {
    const elementArray = this.readIndicatorRefs?.toArray();

    if (!elementArray || elementArray.length === 0) return;

    const messagesWithReadIndicatorsMap = new Map<number, number[]>();

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
