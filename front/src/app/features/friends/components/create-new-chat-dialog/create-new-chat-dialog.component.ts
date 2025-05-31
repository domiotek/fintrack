import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { UserItemComponent } from '../../../../shared/components/user-item/user-item.component';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../core/models/user/user.model';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { combineLatest, take } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './create-new-chat-dialog.component.html',
  styleUrl: './create-new-chat-dialog.component.scss',
})
export class CreateNewChatDialogComponent implements OnInit {
  readonly friends = signal<User[]>([]);
  readonly selectedUser = signal<User | null>(null);
  readonly searchValue = signal<string>('');

  private friendSevice = inject(FriendService);
  private chatService = inject(ChatService);
  private dialogRef = inject(DialogRef<User>);

  ngOnInit() {
    combineLatest([this.friendSevice.getFriendsList(), this.chatService.getUserIdsWithPrivateChat()])
      .pipe(take(1))
      .subscribe(([friends, userIdsWithChats]) => {
        this.friends.set(friends.filter((friend) => !userIdsWithChats.includes(friend.id)));
      });
  }

  onUserSelected(user: User) {
    this.selectedUser.set(user);
  }

  onSearch(value: string) {
    const searchValue = value.toLowerCase();
  }

  onSubmit() {
    this.dialogRef.close(this.selectedUser()!);
  }
}
