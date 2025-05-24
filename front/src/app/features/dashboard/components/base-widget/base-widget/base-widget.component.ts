import { Observable, ReplaySubject } from 'rxjs';
import { IWidget, IWidgetConfig } from '../../../models/widget';
import { signal } from '@angular/core';
import { TimeRange } from '../../../../../core/models/time-range/time-range';
import { EMPTY_DASHBOARD_STATE } from '../../../constants/empty-dasboard-state';

export class BaseWidgetComponent implements IWidget {
  protected readonly onInit = new ReplaySubject<IWidgetConfig>(1);
  protected readonly onLoad = new ReplaySubject<void>(1);
  protected readonly onRefresh = new ReplaySubject<void>(1);

  onInit$: Observable<IWidgetConfig> = this.onInit.asObservable();
  onLoad$: Observable<void> = this.onLoad.asObservable();
  onRefresh$: Observable<void> = this.onRefresh.asObservable();

  timeRange = signal<TimeRange>(EMPTY_DASHBOARD_STATE.timeRange);

  triggerAction(): void {}
}
