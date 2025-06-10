import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { PrivateChat } from '../../../../core/models/chat/chat.model';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_CHAT_ACTIVITY_THRESHOLD } from '../../../../shared/controls/chat/constants/chat.const';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { ActivityTextPipe } from '../../../../shared/pipes/activity-text.pipe';

@Component({
  selector: 'app-chat-item',
  imports: [CommonModule, AvatarComponent, MatIconModule, MatTooltipModule],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.scss',
})
export class ChatItemComponent implements OnInit {
  readonly item = input.required<PrivateChat>();
  readonly currentUserId = signal<number>(0);
  readonly activityText = signal<string>('');
  readonly isAuthorActive = signal<boolean>(false);

  get isAuthorOfLastMessage(): boolean {
    return this.item().lastMessage?.sentBy?.id === this.currentUserId();
  }

  get isUnread(): boolean {
    return (
      !this.isAuthorOfLastMessage &&
      this.item().lastMessage != null &&
      this.item().lastMessage?.id !== this.item().lastReadMessageId
    );
  }

  readonly sentDiff = computed(() => {
    const sentAt = this.item().lastMessage?.sentAt;
    if (!sentAt) return '';

    const messageTime = DateTime.fromISO(sentAt);
    const now = DateTime.now();
    const diffInMinutes = now.diff(messageTime, 'minutes').minutes;

    if (diffInMinutes < 1) {
      return 'Przed chwilą';
    }

    return messageTime.toRelative() ?? '';
  });

  readonly chatService = inject(ChatService);
  readonly appStateStore = inject(AppStateStore);
  readonly destroyRef = inject(DestroyRef);
  readonly activityTextPipe = new ActivityTextPipe();

  ngOnInit(): void {
    this.appStateStore.state$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.currentUserId.set(state.userId!);
    });

    this.chatService.activityTicker$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateActivityStatus();
    });

    this.updateActivityStatus();
  }

  private updateActivityStatus() {
    const activityDateTime = DateTime.fromISO(this.item().otherParticipant.lastSeenAt ?? '');

    this.isAuthorActive.set(activityDateTime > DateTime.now().minus({ minutes: DEFAULT_CHAT_ACTIVITY_THRESHOLD }));

    const text = this.activityTextPipe.transform(activityDateTime);
    this.activityText.set(`Aktywny(-a) ${text}`);
  }
}
