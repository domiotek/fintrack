import { AfterViewInit, Component, DestroyRef, inject, input, OnDestroy, signal, ViewChild } from '@angular/core';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatReadonlyMessageComponent } from './components/chat-readonly-message/chat-readonly-message.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TypingIndicatorComponent } from './components/typing-indicator/typing-indicator.component';
import { ChatService } from '../../../core/services/chat/chat.service';
import { DEFAULT_USER_ACTIVITY_UPDATE_INTERVAL } from './constants/chat.const';
import { AppStateStore } from '../../../core/store/app-state.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../core/models/user/user.model';
import { ChatMessagesWrapperComponent } from './components/chat-messages-wrapper/chat-messages-wrapper.component';
import { ChatStateStore } from './store/chat-state.store';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ChatInputComponent,
    ChatReadonlyMessageComponent,
    TypingIndicatorComponent,
    ChatMessagesWrapperComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewInit, OnDestroy {
  @ViewChild('messagesWrapper') messagesWrapper!: ChatMessagesWrapperComponent;

  readonly chatId = input.required<string>();
  readonly readonly = input<boolean>(false);
  readonly chatParticipants = input.required<User[]>();

  readonly scrollToBottomVisible = signal<boolean>(false);
  readonly typingUsers = signal<string[]>([]);
  readonly currentUserId = signal<number | null>(null);

  private readonly activityUpdateTimer = signal<ReturnType<typeof setInterval> | null>(null);

  private readonly chatService = inject(ChatService);
  private readonly store = inject(ChatStateStore);
  private readonly appStateStore = inject(AppStateStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = this.store.loading;
  readonly scrollSnapMessageId = this.store.scrollSnapMessageId;

  ngAfterViewInit(): void {
    this.appStateStore.appState$.subscribe((state) => {
      this.currentUserId.set(state.userId);
    });

    this.chatService.connectToChat(this.chatId()).then(() => {
      this.store.setLoading(false);
      this.messagesWrapper.tryReadLastMessage();
    });

    document.addEventListener('visibilitychange', this.visibilityChangeEventDispatcher.bind(this));
    window.addEventListener('focus', this.visibilityChangeEventDispatcher.bind(this));
    window.addEventListener('blur', this.visibilityChangeEventDispatcher.bind(this));
    this.setupActivityUpdateTimer();

    this.chatService.typingUsers$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((typingUsers) => {
      const newTypingUsers = this.chatParticipants()
        .filter((user) => typingUsers.includes(user.id) && user.id !== this.currentUserId())
        .map((user) => user.firstName);

      this.typingUsers.set(newTypingUsers);
    });
  }

  ngOnDestroy(): void {
    this.teardownActivityUpdateTimer();
    document.removeEventListener('visibilitychange', this.visibilityChangeEventDispatcher.bind(this));
    window.removeEventListener('focus', this.visibilityChangeEventDispatcher.bind(this));
    window.removeEventListener('blur', this.visibilityChangeEventDispatcher.bind(this));

    this.chatService.disconnectFromChat();
    this.store.reset();
  }

  onSendMessage(message: string): void {
    this.chatService.sendMessage(message);
  }

  private setupActivityUpdateTimer(): void {
    if (this.activityUpdateTimer()) {
      clearInterval(this.activityUpdateTimer()!);
    }

    this.activityUpdateTimer.set(
      setInterval(() => {
        this.chatService.updateLastActivity();
      }, DEFAULT_USER_ACTIVITY_UPDATE_INTERVAL),
    );
  }

  private teardownActivityUpdateTimer(): void {
    if (this.activityUpdateTimer()) {
      clearInterval(this.activityUpdateTimer()!);
      this.activityUpdateTimer.set(null);
    }
  }

  private onWindowFocused(): void {
    this.setupActivityUpdateTimer();
    this.chatService.updateLastActivity();
    this.store.setIsWindowActive(true);
  }

  private onWindowBlurred(): void {
    this.teardownActivityUpdateTimer();
    this.store.setIsWindowActive(false);
  }

  private visibilityChangeEventDispatcher() {
    if (!document.hidden && document.hasFocus()) this.onWindowFocused();
    else this.onWindowBlurred();
  }
}
