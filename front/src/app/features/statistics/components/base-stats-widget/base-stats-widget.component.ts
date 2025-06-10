import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IWidget, IWidgetConfig } from '../../../../core/models/statistics/widget';
import { Observable, ReplaySubject, skip } from 'rxjs';
import { TimeRange } from '../../../../core/models/time-range/time-range';
import { EMPTY_STATS_STATE } from '../../constants/empty-stats-state';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { StatsStateStore } from '../../store/stats-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ template: '' })
export abstract class BaseStatsWidgetComponent implements IWidget, OnInit {
  protected readonly onInit = new ReplaySubject<IWidgetConfig>(1);
  protected readonly onLoad = new ReplaySubject<boolean>(1);
  protected readonly onRefresh = new ReplaySubject<void>(1);

  onInit$: Observable<IWidgetConfig> = this.onInit.asObservable();
  onLoad$: Observable<boolean> = this.onLoad.asObservable();
  onRefresh$: Observable<void> = this.onRefresh.asObservable();

  timeRange = signal<TimeRange>(EMPTY_STATS_STATE.timeRange);

  routingService = inject(RoutingService);
  statsState = inject(StatsStateStore);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.statsState.timeRange$.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe((timeRange) => {
      this.timeRange.set(timeRange);
      this.onRefresh.next();

      this.loadData();
    });

    this.onInit.next({
      hasInteraction: false,
    });

    this.loadData();
  }

  abstract loadData(): void;
  abstract triggerAction(): void;
}
