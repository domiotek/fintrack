import { CustomListComponent } from './../../../../shared/components/custom-list/custom-list.component';
import { Component, inject, input, model, OnDestroy, OnInit, signal, ViewContainerRef } from '@angular/core';
import { EventDetails } from '../../../../core/models/events/event';
import { EventsService } from '../../../../core/services/events/events.service';
import { Pagination } from '../../../../core/models/pagination/pagination';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { Currency } from '../../../../core/models/currency/currency.model';
import { EventBillItemComponent } from '../event-bill-item/event-bill-item.component';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { EventBillsSummaryComponent } from '../event-bills-summary/event-bills-summary.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddEventBillDialogData } from '../../models/add-event-bill-dialog-data';
import { AddEventBillDialogComponent } from '../add-event-bill-dialog/add-event-bill-dialog.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-event-details-bills',
  imports: [
    CommonModule,
    CustomListComponent,
    EventBillItemComponent,
    SpinnerComponent,
    EventBillsSummaryComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './event-details-bills.component.html',
  styleUrl: './event-details-bills.component.scss',
})
export class EventDetailsBillsComponent implements OnInit, OnDestroy {
  private readonly eventsService = inject(EventsService);

  private readonly loadingService = inject(LoadingService);

  private readonly dialog = inject(MatDialog);

  viewContainerRef = inject(ViewContainerRef);

  event = model.required<EventDetails>();

  userCurrency = input.required<Currency>();

  isMobile = input.required<boolean>();

  isLoading = this.loadingService.getLoadingState();

  pagination = signal<Pagination>({
    page: 0,
    size: 10,
  });

  ngOnInit(): void {
    this.handleGetBills();
    this.handleGetSummary();

    this.eventsService.billRefresh$
      .pipe(
        tap(() => {
          this.pagination.set({
            page: 0,
            size: 10,
          });
          this.handleGetBills();
          this.handleGetSummary();
          this.handleGetBills();
          this.handleGetSummary();
        }),
      )
      .subscribe();
  }

  protected onAddBillDialog(): void {
    const dialogData: AddEventBillDialogData = {
      eventId: this.event().id,
      eventCurrency: this.event().currency,
      userCurrency: this.userCurrency(),
    };

    this.dialog.open(AddEventBillDialogComponent, {
      width: '600px',
      data: dialogData,
      viewContainerRef: this.viewContainerRef,
    });
  }

  private handleGetSummary(): void {
    this.eventsService.getEventSummary(this.event().id).subscribe({
      next: (res) => {
        this.event().eventSummary = res;
      },
      error: (error) => {
        console.error('Error fetching event summary:', error);
      },
    });
  }

  private handleGetBills(): void {
    this.eventsService.getEventBills(this.event().id, this.pagination()).subscribe({
      next: (res) => {
        this.event().eventBills = res.content;
      },
      error: (error) => {
        console.error('Error fetching bills:', error);
      },
    });
  }

  ngOnDestroy(): void {
    console.log('EventDetailsBillsComponent destroyed');
  }
}
