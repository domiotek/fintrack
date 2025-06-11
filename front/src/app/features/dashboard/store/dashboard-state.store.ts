import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs/operators';
import { EMPTY_DASHBOARD_STATE } from '../constants/empty-dasboard-state';
import { TimeRange } from '../../../core/models/time-range/time-range';
import { IDashboardState } from '../models/dashboard-state';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardStateStore extends ComponentStore<IDashboardState> {
  private readonly refreshSubject = new Subject<void>();

  constructor() {
    super(EMPTY_DASHBOARD_STATE);
  }

  readonly timeRange$ = this.select((state) => state.timeRange);

  readonly refresh$ = this.refreshSubject.asObservable();

  readonly setTimeRange = this.updater((state, timeRange: TimeRange) => ({
    ...state,
    timeRange,
  }));

  readonly refreshWidgets = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.refreshSubject.next();
      }),
    ),
  );
}
