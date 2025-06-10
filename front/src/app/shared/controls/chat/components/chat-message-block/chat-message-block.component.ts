import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { AvatarComponent } from '../../../../components/avatar/avatar.component';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatMessage } from '../../../../../core/models/chat/message.model';
import { DateTime } from 'luxon';
import { ActivityTextPipe } from '../../../../pipes/activity-text.pipe';
import { DEFAULT_CHAT_ACTIVITY_THRESHOLD } from '../../constants/chat.const';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-message-block',
  imports: [CommonModule, MatTooltipModule, AvatarComponent, ChatMessageComponent],
  templateUrl: './chat-message-block.component.html',
  styleUrl: './chat-message-block.component.scss',
})
export class ChatMessageBlockComponent implements OnInit, OnDestroy {
  readonly type = input.required<'my' | 'their'>();
  readonly name = input.required<string>();
  readonly surname = input.required<string>();
  readonly messages = input.required<ChatMessage[]>();
  readonly readIndicators = input<Record<string, number[]>>({});
  readonly finalized = input<boolean>(false);
  readonly isWindowActive = input<boolean>(true);
  readonly authorActivityDateTime = input.required<string>();
  readonly messageReadEmit = output<number>();

  private readonly isInViewport = signal<boolean>(true);
  readonly activityText = signal<string>('');
  readonly isAuthorActive = signal<boolean>(false);
  private observer!: IntersectionObserver;

  private readonly elementRef = inject(ElementRef);
  private readonly chatService = inject(ChatService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly activityTextPipe = new ActivityTextPipe();

  get lastMessage(): ChatMessage {
    return this.messages()[this.messages().length - 1];
  }

  constructor() {
    effect(() => {
      if (this.finalized()) {
        this.observer.disconnect();
      }
    });

    effect(() => {
      if (this.finalized()) return;

      if (this.isInViewport() && this.isWindowActive() && this.messages().length > 0) {
        this.messageReadEmit.emit(this.lastMessage.id);
      }
    });

    effect(() => {
      this.authorActivityDateTime();
      this.generateActivityText();
    });
  }

  ngOnInit(): void {
    this.setupObserver();

    this.chatService.activityTicker$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.generateActivityText();
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  getReadIndicatorStatus(message: ChatMessage): boolean {
    const readBy = this.readIndicators()[message.id] || [];
    return readBy.length > 0;
  }

  getSentAtString(message: ChatMessage): string {
    return DateTime.fromISO(message.sentAt).toFormat('HH:mm');
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (this.isWindowActive() && entry.isIntersecting) {
            this.messageReadEmit.emit(this.lastMessage.id);

            if (this.finalized()) {
              this.observer.disconnect();
            }
          }

          this.isInViewport.set(entry.isIntersecting);
        });
      },
      { threshold: 0.1 },
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  private generateActivityText() {
    const activityDateTime = DateTime.fromISO(this.authorActivityDateTime());

    this.isAuthorActive.set(activityDateTime > DateTime.now().minus({ minutes: DEFAULT_CHAT_ACTIVITY_THRESHOLD }));

    const text = this.activityTextPipe.transform(activityDateTime);
    this.activityText.set(text);
  }
}
