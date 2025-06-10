import { Component, computed, DestroyRef, effect, inject, input, OnInit, output, signal } from '@angular/core';
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
import { ActivityTextPipe } from '../../../../shared/pipes/activity-text.pipe';

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
export class ChatContainerComponent implements OnInit {
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

  private readonly chatService = inject(ChatService);
  private readonly appStateStore = inject(AppStateStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activityTextPipe = new ActivityTextPipe();

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

    this.chatService.activityTicker$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.generateActivityText();
    });
  }

  onGoBack(): void {
    this.goBackEmit.emit();
  }

  private generateActivityText() {
    if (!this.otherParticipant()) return;

    const text = this.activityTextPipe.transform(this.lastActiveDateTime());
    this.activityText.set(text);
  }
}
