import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { UserItemComponent } from '../../../../shared/components/user-item/user-item.component';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../core/models/user/user.model';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { combineLatest, take } from 'rxjs';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { FormsModule } from '@angular/forms';
import { callDebounced } from '../../../../utils/debouncer';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';

@Component({
  selector: 'app-create-new-chat-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CustomListComponent,
    UserItemComponent,
    SearchInputComponent,
    FormsModule,
    FormProgressBarComponent,
  ],
  templateUrl: './create-new-chat-dialog.component.html',
  styleUrl: './create-new-chat-dialog.component.scss',
})
export class CreateNewChatDialogComponent implements OnInit {
  readonly friends = signal<User[]>([]);
  readonly selectedUser = signal<User | null>(null);
  readonly searchValue = signal<string>('');
  readonly loading = signal<boolean>(true);

  private friendSevice = inject(FriendService);
  private chatService = inject(ChatService);
  private dialogRef = inject(MatDialogRef<CreateNewChatDialogComponent, User>);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    combineLatest([this.friendSevice.friends$, this.chatService.getUserIdsWithPrivateChat()]).subscribe(
      ([friends, userIdsWithChats]) => {
        this.friends.set(friends.filter((friend) => !userIdsWithChats.includes(friend.id)));
      },
    );
    this.searchFriends();
  }
  searchFriends = callDebounced(
    () => {
      this.loading.set(true);
      this.friendSevice.getFriendsList(this.searchValue()).subscribe(() => {
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

  onSubmit() {
    this.dialogRef.close(this.selectedUser()!);
  }
}
