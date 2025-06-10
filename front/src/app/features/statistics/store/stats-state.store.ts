import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TimeRange } from '../../../core/models/time-range/time-range';
import { IStatsState } from '../models/stats-state';
import { EMPTY_STATS_STATE } from '../constants/empty-stats-state';

@Injectable({ providedIn: 'root' })
export class StatsStateStore extends ComponentStore<IStatsState> {
  constructor() {
    super(EMPTY_STATS_STATE);
  }

  readonly timeRange$ = this.select((state) => state.timeRange);

  readonly setTimeRange = this.updater((state, timeRange: TimeRange) => ({
    ...state,
    timeRange,
  }));
}
