import { Component, computed, DestroyRef, inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { TimeRange } from '../../../../core/models/time-range/time-range';
import { EMPTY_STATS_STATE } from '../../constants/empty-stats-state';
import { StatsStateStore } from '../../store/stats-state.store';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { callDebounced as debounceHandler } from '../../../../utils/debouncer';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TimeRangeSelectorComponent } from '../../../../shared/components/time-range-selector/time-range-selector.component';
import { WidgetWrapperComponent } from '../../../../shared/components/widget-wrapper/widget-wrapper.component';
import { ExpensesStatsWidgetComponent } from '../../components/expenses-stats-widget/expenses-stats-widget.component';
import { CategoriesStatsWidgetComponent } from '../../components/categories-stats-widget/categories-stats-widget.component';
import { TransactionsStatsWidgetComponent } from '../../components/transactions-stats-widget/transactions-stats-widget.component';
import { DayOfWeekStatsWidgetComponent } from '../../components/day-of-week-stats-widget/day-of-week-stats-widget.component';
import { AllBillsWidgetComponent } from '../../components/all-bills-widget/all-bills-widget.component';

@Component({
  selector: 'app-statistics',
  imports: [
    CommonModule,
    MatButtonModule,
    TimeRangeSelectorComponent,
    WidgetWrapperComponent,
    ExpensesStatsWidgetComponent,
    CategoriesStatsWidgetComponent,
    TransactionsStatsWidgetComponent,
    DayOfWeekStatsWidgetComponent,
    AllBillsWidgetComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit {
  timeRange = signal<TimeRange>(EMPTY_STATS_STATE.timeRange);

  statsState = inject(StatsStateStore);
  destroyRef = inject(DestroyRef);
  dialog = inject(MatDialog);
  viewContainerRef = inject(ViewContainerRef);

  projectionRange = computed(() => {
    return {
      from: this.timeRange().from.startOf('month'),
      to: this.timeRange().to.endOf('month'),
    };
  });

  rangeConstraints = computed(() => {
    return {
      max: DateTime.now().endOf('month'),
    };
  });

  ngOnInit(): void {
    this.statsState.timeRange$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((timeRange) => {
      this.timeRange.set(timeRange);
    });
  }

  onProjectionDateChange = debounceHandler(
    (timeRange: TimeRange) => {
      this.statsState.setTimeRange(timeRange);
    },
    300,
    this.destroyRef,
  );
}
