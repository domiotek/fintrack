import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { NgScrollReached } from 'ngx-scrollbar/reached-event';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PrivateChat } from '../../../../core/models/chat/chat.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewChatDialogComponent } from '../create-new-chat-dialog/create-new-chat-dialog.component';
import { User } from '../../../../core/models/users/user';
import { RemoveFriendDialogComponent } from '../remove-friend-dialog/remove-friend-dialog.component';
import { callDebounced } from '../../../../utils/debouncer';
import { ChatItemComponent } from '../chat-item/chat-item.component';
import { FormsModule } from '@angular/forms';
import { FriendsStateStore } from '../../store/friends-state.store';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgScrollbarModule,
    SearchInputComponent,
    CustomListComponent,
    NgScrollReached,
    SpinnerComponent,
    ChatItemComponent,
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
})
export class ChatListComponent implements OnInit {
  readonly searchValue = signal<string>('');
  readonly chats = signal<PrivateChat[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly currentPage = signal<number>(0);
  readonly hasMorePages = signal<boolean>(true);
  readonly newlyAddedChat = signal<PrivateChat | null>(null);

  private readonly chatService = inject(ChatService);
  private readonly store = inject(FriendsStateStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly selectedChat = this.store.selectedChat;

  ngOnInit(): void {
    this.loadMoreChats();

    this.chatService.privateChatsUpdates$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((chat) => {
      const currentChats = this.chats();
      const existingChatIndex = currentChats.findIndex((c) => c.id === chat.id);

      if (existingChatIndex !== -1) {
        currentChats.splice(existingChatIndex, 1);
        currentChats.unshift(chat);
      } else {
        currentChats.unshift(chat);
      }

      this.chats.set(currentChats);
      this.changeDetectionRef.markForCheck();
    });
  }

  onSearch(val: string): void {
    this.searchValue.set(val);
    this.chats.set([]);
    this.currentPage.set(0);

    if (this.selectedChat()?.id === this.newlyAddedChat()?.id) {
      this.cleanUpNewlyAddedChat();
      this.store.setSelectedChat(null);
    }

    this.loadMoreChats();
  }

  unselectChat() {
    this.store.setSelectedChat(null);
  }

  onChatSelect(chat: PrivateChat): void {
    if (this.newlyAddedChat() && this.newlyAddedChat()?.id !== chat.id) {
      this.cleanUpNewlyAddedChat();
    }

    this.store.setSelectedChat(chat);
  }

  onScrolledBottom(): void {
    if (this.isLoading() || !this.hasMorePages()) return;

    this.currentPage.update((page) => page + 1);
    this.loadMoreChats();
  }

  openCreateChatDialog(): void {
    const dialogRef = this.dialog.open(CreateNewChatDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });

    dialogRef.afterClosed().subscribe((result?: User) => {
      if (!result) return;

      this.chatService.getPrivateChatIdByUserId(result.id).subscribe((chatId) => {
        this.cleanUpNewlyAddedChat();
        const newChat: PrivateChat = {
          id: chatId,
          otherParticipant: result,
          lastMessage: null,
          lastReadMessageId: null,
          isFriend: true,
        };

        this.chats.set([newChat, ...this.chats()]);
        this.store.setSelectedChat(newChat);
        this.newlyAddedChat.set(newChat);
      });
    });
  }

  openRemoveFriendDialog(): void {
    this.dialog.open(RemoveFriendDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });
  }

  private readonly loadMoreChats = callDebounced(
    () => {
      this.isLoading.set(true);
      this.chatService.getPrivateChatsList(this.currentPage(), this.searchValue()).subscribe((chats) => {
        const currentChats = this.chats();
        this.chats.set([...currentChats, ...chats.content]);
        this.isLoading.set(false);
        this.hasMorePages.set(chats.page.number < chats.page.totalPages);
      });
    },
    300,
    this.destroyRef,
  );

  private cleanUpNewlyAddedChat(): void {
    this.chats.set([...this.chats().filter((c) => c.id !== this.newlyAddedChat()?.id)]);
  }
}
