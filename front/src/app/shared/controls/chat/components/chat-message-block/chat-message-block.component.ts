import { Component, effect, ElementRef, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { AvatarComponent } from '../../../../components/avatar/avatar.component';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatMessage } from '../../../../../core/models/chat/message.model';
import { DateTime } from 'luxon';

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
  readonly messageReadEmit = output<string>();

  private readonly isInViewport = signal<boolean>(true);
  private readonly isWindowActive = signal<boolean>(!document.hidden && document.hasFocus());
  private observer!: IntersectionObserver;

  private readonly elementRef = inject(ElementRef);

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
  }

  ngOnInit(): void {
    this.setupObserver();
    document.addEventListener('visibilitychange', this.onWindowStateChange);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    document.removeEventListener('visibilitychange', this.onWindowStateChange);
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

  private onWindowStateChange = (): void => {
    this.isWindowActive.set(!document.hidden && document.hasFocus());
  };
}
