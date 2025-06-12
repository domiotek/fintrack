import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { User } from '../../../../core/models/user/user.model';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { UserItemComponent } from '../../../../shared/components/user-item/user-item.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../../../core/models/dialog/confirmation-dialog-data';
import { callDebounced } from '../../../../utils/debouncer';

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
    FormProgressBarComponent,
  ],
  templateUrl: './remove-friend-dialog.component.html',
  styleUrl: './remove-friend-dialog.component.scss',
})
export class RemoveFriendDialogComponent implements OnInit {
  readonly friends = signal<User[]>([]);
  readonly selectedUser = signal<User | null>(null);
  readonly searchValue = signal<string>('');
  readonly loading = signal<boolean>(true);
  readonly processing = signal<boolean>(false);

  private readonly friendSevice = inject(FriendService);
  private readonly matDialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.searchFriends();
  }

  searchFriends = callDebounced(
    () => {
      this.loading.set(true);
      this.friendSevice.getFriendsList(this.searchValue()).subscribe((friends) => {
        this.friends.set(friends);
        this.loading.set(false);
      });
    },
    300,
    this.destroyRef,
  );

  onUserSelected(user: User) {
    this.selectedUser.set(user);
  }

  onSearch(value: string) {
    this.searchValue.set(value);
    this.searchFriends();
  }

  onRemoveFriendAttempt(user: User) {
    if (this.processing()) return;

    const dialogData: ConfirmationDialogData = {
      title: 'Czy na pewno chcesz kontynuować?',
      message: 'Ta operacja jest nieodwracalna. Kontynuować?',
    };

    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((accepted) => {
      if (!accepted) return;

      this.processing.set(true);

      this.friendSevice.removeFriend(user.id).subscribe({
        next: () => {
          this.processing.set(false);
          this.friends.update((currentFriends) => currentFriends.filter((friend) => friend.id !== user.id));
          this.selectedUser.set(null);
          this.snackBar.open('Znajomy został usunięty.', 'Zamknij', {
            duration: 3000,
          });
        },
        error: () => {
          this.processing.set(false);
          this.snackBar.open('Nie udało się usunąć znajomego. Spróbuj ponownie.', 'Zamknij');
        },
      });
    });
  }
}
