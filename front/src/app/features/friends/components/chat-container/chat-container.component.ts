import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { NoSelectedComponent } from '../../../../shared/components/no-selected/no-selected.component';
import { PrivateChat } from '../../../../core/models/chat/chat.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { ChatComponent } from '../../../../shared/controls/chat/chat.component';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { User } from '../../../../core/models/user/user.model';

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
  readonly chat = input<PrivateChat | null>(null);
  readonly isMobile = input<boolean>(false);
  readonly otherParticipant = input.required<User>();
  readonly goBackEmit = output<void>();

  readonly currentUserId = signal<number | null>(null);
  readonly lastActiveDateTime = signal<DateTime | null>(null);
  readonly activityText = signal<string>('');
  readonly showChat = signal<boolean>(true);

  readonly isActive = computed(() => {
    return this.activityText() === 'teraz';
  });

  private readonly updateInterval = 60000;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  private readonly chatService = inject(ChatService);
  private readonly appStateStore = inject(AppStateStore);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.chat();
      this.showChat.set(false);
      setTimeout(() => this.showChat.set(true), 0);
    });
  }

  ngOnInit(): void {
    this.appStateStore.appState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.currentUserId.set(state.userId ?? null);
    });

    this.chatService.lastUserActivityMap$.subscribe((activityMap) => {
      const isoDate = activityMap[this.otherParticipant()?.id];
      const dateTime = DateTime.fromISO(isoDate);

      if (dateTime.isValid) {
        this.lastActiveDateTime.set(dateTime);
      }
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
    if (!this.otherParticipant()) return;

    if (!this.lastActiveDateTime()?.isValid) {
      return this.activityText.set('');
    }

    const diffInMinutes = Math.abs(this.lastActiveDateTime()!.diffNow('minutes').minutes);

    const newdiff = diffInMinutes < 4 ? 'teraz' : (this.lastActiveDateTime()!.toRelative({ style: 'long' }) ?? '');

    this.activityText.set(newdiff);
  }
}
