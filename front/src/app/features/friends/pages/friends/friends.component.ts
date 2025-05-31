import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, ViewContainerRef } from '@angular/core';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { NoSelectedComponent } from '../../../../shared/components/no-selected/no-selected.component';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { Chat } from '../../../../core/models/chat/chat.model';
import { ChatItemComponent } from '../../components/chat-item/chat-item.component';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendDialogComponent } from '../../components/add-friend-dialog/add-friend-dialog.component';
import { PendingFriendRequestsDialogComponent } from '../../components/pending-friend-requests-dialog/pending-friend-requests-dialog.component';
import { CreateNewChatDialogComponent } from '../../components/create-new-chat-dialog/create-new-chat-dialog.component';
import { RemoveFriendDialogComponent } from '../../components/remove-friend-dialog/remove-friend-dialog.component';

@Component({
  selector: 'app-friends',
  imports: [
    CommonModule,
    FormsModule,
    SearchInputComponent,
    CustomListComponent,
    NoSelectedComponent,
    MatIconModule,
    MatButtonModule,
    ChatItemComponent,
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {
  readonly isMobile = signal<boolean>(false);
  readonly selectedChatId = signal<number | null>(null);
  readonly searchValue = signal<string>('');
  readonly chats = signal<Chat[]>([]);

  private readonly destroyRef = inject(DestroyRef);
  private readonly observer = inject(BreakpointObserver);
  private readonly chatsService = inject(ChatService);
  private readonly dialog = inject(MatDialog);
  private readonly viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    this.observer
      .observe('(max-width: 768px)')
      .pipe(
        tap((res) => {
          this.isMobile.set(res.matches);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.chatsService.getPrivateChatsList().subscribe((chats) => {
      this.chats.set(chats);
    });
  }

  onSearch(val: string): void {}

  onChatSelect(category: any | null): void {
    if (!category) {
      this.selectedChatId.set(null);
    }
  }

  openAddFriendDialog(): void {
    this.dialog.open(AddFriendDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });
  }

  openPendingFriendRequestsDialog(): void {
    this.dialog.open(PendingFriendRequestsDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });
  }

  openCreateChatDialog(): void {
    const dialogRef = this.dialog.open(CreateNewChatDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog result:', result);
        // Handle the returned data
      }
    });
  }

  openRemoveFriendDialog(): void {
    this.dialog.open(RemoveFriendDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });
  }
}
