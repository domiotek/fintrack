import { Component, inject, signal } from '@angular/core';
import { User } from '../../../../core/models/user/user.model';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { UserItemComponent } from '../../../../shared/components/user-item/user-item.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { CreateNewChatDialogComponent } from '../create-new-chat-dialog/create-new-chat-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-remove-friend-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    SearchInputComponent,
    CustomListComponent,
    UserItemComponent,
  ],
  templateUrl: './remove-friend-dialog.component.html',
  styleUrl: './remove-friend-dialog.component.scss',
})
export class RemoveFriendDialogComponent {
  readonly friends = signal<User[]>([]);
  readonly selectedUser = signal<User | null>(null);
  readonly searchValue = signal<string>('');
  readonly processing = signal<boolean>(false);

  private readonly friendSevice = inject(FriendService);
  private readonly matDialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.friendSevice
      .getFriendsList()
      .pipe(take(1))
      .subscribe((friends) => {
        this.friends.set(friends);
      });
  }

  onUserSelected(user: User) {
    this.selectedUser.set(user);
  }

  onSearch(value: string) {
    const searchValue = value.toLowerCase();
  }

  onRemoveFriendAttempt(user: User) {
    if (this.processing()) return;

    const dialogRef = this.matDialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((accepted) => {
      if (!accepted) return;

      this.processing.set(true);

      this.friendSevice.removeFriend(user.id).subscribe({
        next: () => {
          this.processing.set(false);
        },
        error: () => {
          this.processing.set(false);
          this.snackBar.open('Nie udało się usunąć znajomego. Spróbuj ponownie.', 'Zamknij');
        },
      });
    });
  }
}
