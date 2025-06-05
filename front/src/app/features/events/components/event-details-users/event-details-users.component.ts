import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { EventsService } from '../../../../core/services/events/events.service';
import { EventDetails } from '../../../../core/models/events/event';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationDialogData } from '../../../../core/models/dialog/confirmation-dialog-data';
import { User } from '../../../../core/models/users/user';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-event-details-users',
  imports: [CommonModule, MatButtonModule, MatIconModule, CustomListComponent],
  templateUrl: './event-details-users.component.html',
  styleUrl: './event-details-users.component.scss',
})
export class EventDetailsUsersComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  private readonly dialog = inject(MatDialog);

  private readonly destroyRef = inject(DestroyRef);

  event = input.required<EventDetails>();

  userId = input.required<number>();

  usersWhoPaid = signal<number[]>([]);

  emitUserDeletion = output<number>();

  ngOnInit(): void {
    this.handleGetUsersWhoPaid();
  }

  protected addUser(): void {
    console.log('Add user.'); // placeholder czekając na friendsów
  }

  protected deleteUser(user: User): void {
    const data: ConfirmationDialogData = {
      title: 'Usuń użytkownika',
      message: `Czy na pewno chcesz usunąć użytkownika ${user.firstName} ${user.lastName} z wydarzenia?`,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data,
      width: '400px',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res) {
            this.eventsService
              .deleteUserFromEvent(this.event().id, user.id)
              .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap(() => this.emitUserDeletion.emit(user.id)),
              )
              .subscribe();
          }
        },
        error: (err) => {
          console.error('Error closing dialog:', err);
        },
      });
  }

  private handleGetUsersWhoPaid(): void {
    this.eventsService
      .getEventUsersWhoPaid(this.event().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.usersWhoPaid.set(res);
          console.log('Users who paid:', this.usersWhoPaid());
        },
        error: (err) => {
          console.error('Error fetching users who paid:', err);
        },
      });
  }
}
