import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { FriendRequestItemComponent } from '../friend-request-item/friend-request-item.component';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { FriendRequest } from '../../../../core/models/friend/friend-request.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pending-friend-requests-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CustomListComponent,
    FriendRequestItemComponent,
    FormProgressBarComponent,
  ],
  templateUrl: './pending-friend-requests-dialog.component.html',
  styleUrl: './pending-friend-requests-dialog.component.scss',
})
export class PendingFriendRequestsDialogComponent implements OnInit {
  readonly friendRequests = signal<FriendRequest[]>([]);
  readonly loading = signal<boolean>(false);

  private readonly friendService = inject(FriendService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.friendService.friendRequests$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((requests) => {
      this.friendRequests.set(requests);
    });

    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.friendService.getPendingFriendRequests().subscribe({
      complete: () => {
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Nie udało się pobrać listy oczekujących zaproszeń.', 'Zamknij');
        this.loading.set(false);
      },
    });
  }
}
