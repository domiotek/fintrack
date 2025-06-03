import { CustomListComponent } from './../../../../shared/components/custom-list/custom-list.component';
import { Component, inject, input, model, OnDestroy, OnInit, signal } from '@angular/core';
import { EventDetails } from '../../../../core/models/events/event';
import { EventsService } from '../../../../core/services/events/events.service';
import { Pagination } from '../../../../core/models/pagination/pagination';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { Currency } from '../../../../core/models/currency/currency.model';
import { EventBillItemComponent } from '../event-bill-item/event-bill-item.component';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { EventBillsSummaryComponent } from '../event-bills-summary/event-bills-summary.component';

@Component({
  selector: 'app-event-details-bills',
  imports: [CommonModule, CustomListComponent, EventBillItemComponent, SpinnerComponent, EventBillsSummaryComponent],
  templateUrl: './event-details-bills.component.html',
  styleUrl: './event-details-bills.component.scss',
})
export class EventDetailsBillsComponent implements OnInit, OnDestroy {
  private readonly eventsService = inject(EventsService);

  private readonly loadingService = inject(LoadingService);

  event = model.required<EventDetails>();

  userCurrency = input.required<Currency>();

  isLoading = this.loadingService.getLoadingState();

  pagination = signal<Pagination>({
    page: 0,
    size: 10,
  });

  ngOnInit(): void {
    this.eventsService.getEventBills(this.event().id, this.pagination()).subscribe({
      next: (res) => {
        this.event().eventBills = res.content;
      },
      error: (error) => {
        console.error('Error fetching bills:', error);
      },
    });

    this.eventsService.getEventSummary(this.event().id).subscribe({
      next: (res) => {
        this.event().eventSummary = res;
      },
      error: (error) => {
        console.error('Error fetching event summary:', error);
      },
    });
  }

  ngOnDestroy(): void {
    console.log('EventDetailsBillsComponent destroyed');
  }
}
