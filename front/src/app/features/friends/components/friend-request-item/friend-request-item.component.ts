import { Component, inject, input, signal } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { FriendRequest } from '../../../../core/models/friend/friend-request.model';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-friend-request-item',
  imports: [CommonModule, AvatarComponent, MatIconModule, MatButtonModule],
  templateUrl: './friend-request-item.component.html',
  styleUrl: './friend-request-item.component.scss',
})
export class FriendRequestItemComponent {
  readonly item = input.required<FriendRequest>();
  readonly disabled = input<boolean>(false);
  readonly submitting = signal<boolean>(false);

  get sentDiff(): string {
    return DateTime.fromISO(this.item().createdAt).toRelative() ?? '';
  }

  private readonly friendServive = inject(FriendService);
  private readonly snackBar = inject(MatSnackBar);

  onAccept(): void {
    this.submitting.set(true);
    this.friendServive.answerFriendRequest(this.item().id, true).subscribe({
      complete: () => {
        this.submitting.set(false);
      },
      error: () => {
        this.submitting.set(false);
        this.snackBar.open('Nie udało się zaakceptować tego zaproszenia.', 'Zamknij');
      },
    });
  }
  onReject(): void {
    this.submitting.set(true);
    this.friendServive.answerFriendRequest(this.item().id, false).subscribe({
      complete: () => {
        this.submitting.set(false);
      },
      error: () => {
        this.snackBar.open('Nie udało się odrzucić tego zaproszenia.', 'Zamknij');
        this.submitting.set(false);
      },
    });
  }
}
