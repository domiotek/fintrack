import { Component, computed, DestroyRef, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { NoSelectedComponent } from '../../../../shared/components/no-selected/no-selected.component';
import { Chat } from '../../../../core/models/chat/chat.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { ChatComponent } from '../../../../shared/controls/chat/chat.component';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { Participant } from '../../../../core/models/chat/participant.model';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-chat-container',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NoSelectedComponent,
    AvatarComponent,
    ChatComponent,
  ],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.scss',
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  readonly visible = input<boolean>(false);
  readonly chat = input<Chat | null>(null);
  readonly isMobile = input<boolean>(false);
  readonly goBackEmit = output<void>();

  readonly otherParticiapnt = signal<Participant | null>(null);
  readonly currentUserId = signal<number | null>(null);
  readonly activityText = signal<string>('');

  readonly isActive = computed(() => {
    return this.activityText() === 'teraz';
  });

  private readonly updateInterval = 60000;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  private readonly chatService = inject(ChatService);
  private readonly appStateStore = inject(AppStateStore);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.appStateStore.appState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.currentUserId.set(state.userId || null);
    });

    this.chatService.participants$.subscribe((participants) => {
      this.otherParticiapnt.set(participants.find((participant) => participant.id !== this.currentUserId()) || null);
      this.generateActivityText();
    });

    this.intervalId = setInterval(this.generateActivityText.bind(this), this.updateInterval);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onGoBack(): void {
    this.goBackEmit.emit();
  }

  private generateActivityText() {
    if (!this.otherParticiapnt()) return;

    const dateTime = DateTime.fromISO(this.otherParticiapnt()?.lastSeenAt!);

    if (!dateTime.isValid) return;

    const diffInMinutes = Math.abs(dateTime.diffNow('minutes').minutes);

    const newdiff = diffInMinutes < 4 ? 'teraz' : dateTime.toRelative({ style: 'long' }) || '';

    this.activityText.set(newdiff);
  }
}
