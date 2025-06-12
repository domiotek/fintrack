import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, ViewContainerRef, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendDialogComponent } from '../../components/add-friend-dialog/add-friend-dialog.component';
import { PendingFriendRequestsDialogComponent } from '../../components/pending-friend-requests-dialog/pending-friend-requests-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { ChatContainerComponent } from '../../components/chat-container/chat-container.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { FriendsStateStore } from '../../store/friends-state.store';

@Component({
  selector: 'app-friends',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    ChatContainerComponent,
    MatProgressSpinnerModule,
    ChatListComponent,
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent implements OnInit {
  readonly isMobile = signal<boolean>(false);

  private readonly store = inject(FriendsStateStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly observer = inject(BreakpointObserver);
  private readonly dialog = inject(MatDialog);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly selectedChat = this.store.selectedChat;

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

  unselectChat(): void {
    this.store.setSelectedChat(null);
  }
}
