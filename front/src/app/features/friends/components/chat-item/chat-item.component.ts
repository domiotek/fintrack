import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { PrivateChat } from '../../../../core/models/chat/chat.model';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-chat-item',
  imports: [CommonModule, AvatarComponent, MatIconModule],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.scss',
})
export class ChatItemComponent implements OnInit {
  readonly item = input.required<PrivateChat>();
  readonly currentUserId = signal<number>(0);

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

  readonly appStateStore = inject(AppStateStore);
  readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.appStateStore.state$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.currentUserId.set(state.userId!);
    });
  }
}
