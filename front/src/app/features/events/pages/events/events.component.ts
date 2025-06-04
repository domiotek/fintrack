import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { EventsService } from '../../../../core/services/events/events.service';
import { EventFilters } from '../../../../core/models/events/event-filters';
import { Pagination } from '../../../../core/models/pagination/pagination';
import { CommonModule } from '@angular/common';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { EventItemComponent } from '../../components/event-item/event-item.component';
import { TimeRangeSelectorComponent } from '../../../../shared/components/time-range-selector/time-range-selector.component';
import { TimeRange } from '../../../../core/models/time-range/time-range';
import { EMPTY_EVENT_STATE } from '../../../categories/constants/empty-event-state';
import { callDebounced as debounceHandler } from '../../../../utils/debouncer';
import { EventStateStore } from '../../store/event-state.store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SortMenuComponent } from '../../../../shared/components/sort-menu/sort-menu.component';
import { SortState } from '../../../../core/models/sort/sort-state';
import { EVENTS_START_SORT_STATE } from '../../../categories/constants/events-start-sort-state';
import { SortItem } from '../../../../core/models/sort/sort-item';
import { EVENTS_SORT_ITEMS } from '../../../categories/constants/events-sort-items';
import { EventDetailsComponent } from '../../components/event-details/event-details.component';
import { NoSelectedComponent } from '../../../../shared/components/no-selected/no-selected.component';
import { Event } from '../../../../core/models/events/event';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';

@Component({
  selector: 'app-events',
  imports: [
    CommonModule,
    CustomListComponent,
    EventItemComponent,
    TimeRangeSelectorComponent,
    MatIconModule,
    MatButtonModule,
    SearchInputComponent,
    FormsModule,
    SortMenuComponent,
    EventDetailsComponent,
    NoSelectedComponent,
    SpinnerComponent,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  private readonly categoryState = inject(EventStateStore);

  private readonly observer = inject(BreakpointObserver);

  private readonly destroyRef = inject(DestroyRef);

  isSearching = signal<boolean>(false);

  isMobile = signal<boolean>(false);

  events = this.eventsService.events;

  selectedEvent = signal<Event | null>(null);

  filters = signal<EventFilters>({
    name: null,
    eventStatus: null,
    from: null,
    to: null,
  });

  pagination = signal<Pagination>({
    page: 0,
    size: 10,
  });

  sortState = signal<SortState>(EVENTS_START_SORT_STATE);

  sortOptions = signal<SortItem[]>(EVENTS_SORT_ITEMS);

  readonly timeRange = signal<TimeRange>(EMPTY_EVENT_STATE.timeRange);

  projection_range = computed(() => ({
    from: this.timeRange().from.startOf('month'),
    to: this.timeRange().to.endOf('month'),
  }));

  reload = signal<boolean>(false);

  ngOnInit(): void {
    this.filters.set({
      ...this.filters(),
      from: `${this.timeRange().from.toISO()}`,
      to: `${this.timeRange().to.toISO()}`,
    });

    this.getEvents();

    this.observer
      .observe('(max-width: 1024px)')
      .pipe(
        tap((res) => {
          this.isMobile.set(res.matches);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onSearch(searchValue: string): void {
    this.filters.set({
      ...this.filters(),
      name: searchValue || null,
    });
    this.getEvents();
    this.selectedEvent.set(null);
  }

  onProjectionDateChange = debounceHandler((timeRange: TimeRange) => {
    this.categoryState.setTimeRange(timeRange);
    this.timeRange.set(timeRange);
    this.filters.set({
      ...this.filters(),
      from: `${timeRange.from.toISO()}`,
      to: `${timeRange.to.toISO()}`,
    });

    this.onSearch(this.filters().name || '');
  }, 300);

  onEventSelect(event: Event | null): void {
    if (!event) {
      this.selectedEvent.set(null);
      return;
    }
    this.reload.set(true);
    setTimeout(() => {
      this.reload.set(false);
    }, 250);
  }

  onSortChange(state: SortState): void {
    this.sortState.set({ ...state });
    this.getEvents();
  }

  private getEvents(): void {
    this.isSearching.set(true);
    this.eventsService
      .getEvents(this.filters(), this.pagination())
      .pipe(
        finalize(() => this.isSearching.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
