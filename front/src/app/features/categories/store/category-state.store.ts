import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TimeRange } from '../../../core/models/time-range/time-range';
import { ICategoryState } from '../models/category-state';
import { EMPTY_CATEGORY_STATE } from '../constants/empty-category-state';

@Injectable({ providedIn: 'root' })
export class CategoryStateStore extends ComponentStore<ICategoryState> {
  constructor() {
    super(EMPTY_CATEGORY_STATE);
  }

  readonly timeRange$ = this.select((state) => state.timeRange);

  readonly setTimeRange = this.updater((state, timeRange: TimeRange) => ({
    ...state,
    timeRange,
  }));
}
