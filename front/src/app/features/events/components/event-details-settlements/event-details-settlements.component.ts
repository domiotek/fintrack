import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { EventDetails } from '../../../../core/models/events/event';
import { Currency } from '../../../../core/models/currency/currency.model';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { EventsService } from '../../../../core/services/events/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';

@Component({
  selector: 'app-event-details-settlements',
  imports: [CommonModule, CustomListComponent, SpinnerComponent],
  templateUrl: './event-details-settlements.component.html',
  styleUrl: './event-details-settlements.component.scss',
})
export class EventDetailsSettlementsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  private readonly loadingService = inject(LoadingService);

  private readonly destroyRef = inject(DestroyRef);

  event = input.required<EventDetails>();

  userCurrency = input.required<Currency>();

  isLoading = this.loadingService.getLoadingState();

  bilance = signal<{
    event: number;
    user: number;
  }>({
    event: 0,
    user: 0,
  });

  ngOnInit(): void {
    this.handleGetBills();
  }

  private handleGetBills(): void {
    this.eventsService
      .getSettlements(this.event().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.event().eventSettlements = res;
          this.bilance.set({
            event: res.reduce((acc, settlement) => acc + settlement.settlement.eventCurrency, 0),
            user: res.reduce((acc, settlement) => acc + settlement.settlement.userCurrency, 0),
          });
        },
        error: (err) => {
          console.error('Error fetching settlements:', err);
        },
      });
  }
}
