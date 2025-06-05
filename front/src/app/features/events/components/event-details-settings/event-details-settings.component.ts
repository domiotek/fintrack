import { Component, DestroyRef, inject, input, OnDestroy, OnInit, output, ViewContainerRef } from '@angular/core';
import { EventsService } from '../../../../core/services/events/events.service';
import { EventDetails } from '../../../../core/models/events/event';
import { Currency } from '../../../../core/models/currency/currency.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogData } from '../../../../core/models/dialog/confirmation-dialog-data';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-event-details-settings',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './event-details-settings.component.html',
  styleUrl: './event-details-settings.component.scss',
})
export class EventDetailsSettingsComponent implements OnInit, OnDestroy {
  private readonly eventsService = inject(EventsService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly dialog = inject(MatDialog);

  private readonly viewContainerRef = inject(ViewContainerRef);

  event = input.required<EventDetails>();

  userCurrency = input.required<Currency>();

  userId = input.required<number>();

  ngOnInit(): void {
    console.log('EventDetailsSettingsComponent initialized');
  }

  protected editEvent(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '600px',
      data: this.event(),
      viewContainerRef: this.viewContainerRef,
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          if (res) {
            this.eventsService.emitEventRefresh();
          }
        }),
      )
      .subscribe();
  }

  protected deleteEvent(): void {
    const data: ConfirmationDialogData = {
      title: 'Usuń wydarzenie',
      message: 'Czy na pewno chcesz usunąć to wydarzenie? Ta operacja jest nieodwracalna.',
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data,
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          if (res) {
            this.eventsService
              .deleteEvent(this.event().id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                complete: () => {
                  this.eventsService.emitEventRefresh();
                },
                error: (error) => {
                  console.error('Error deleting event:', error);
                },
              });
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    console.log('EventDetailsSettingsComponent destroyed');
  }
}
