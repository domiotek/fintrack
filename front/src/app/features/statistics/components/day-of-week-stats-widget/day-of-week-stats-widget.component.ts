import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseStatsWidgetComponent } from '../base-stats-widget/base-stats-widget.component';
import { IWidget } from '../../../../core/models/statistics/widget';
import { StatisticsService } from '../../../../core/services/statistics/statistics.service';
import { Stats } from '../../../../core/models/statistics/stats.model';
import { StatsOperations, StatsOperationType } from '../../../../core/models/statistics/stats-operations';
import { OperationStatsRequest } from '../../../../core/models/statistics/operation-stats.request';
import { BarChartComponent } from '../../../../shared/components/bar-chart/bar-chart.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { SelectOperationTypeComponent } from '../select-operation-type/select-operation-type.component';

@Component({
  selector: 'app-day-of-week-stats-widget',
  imports: [BarChartComponent, NoDataComponent, SelectOperationTypeComponent],
  templateUrl: './day-of-week-stats-widget.component.html',
  styleUrl: './day-of-week-stats-widget.component.scss',
})
export class DayOfWeekStatsWidgetComponent extends BaseStatsWidgetComponent implements IWidget, OnInit {
  private readonly statisticsService = inject(StatisticsService);

  readonly data = signal<Stats | null>(null);

  filters = signal<StatsOperationType>(StatsOperations.SUM);

  shouldShow = signal<boolean>(false);

  override ngOnInit() {
    super.ngOnInit();
  }

  loadData(): void {
    const req: OperationStatsRequest = {
      from: this.timeRange().from.toISO()!,
      to: this.timeRange().to.toISO()!,
      operation: this.filters(),
    };

    this.statisticsService.getDayOfWeekStats(req).subscribe({
      next: (stats) => {
        this.data.set(stats);
        this.onLoad.next(true);
        this.shouldShow.set(stats.data.reduce((acc, curr) => acc + curr, 0) > 0);
      },
      error: () => {
        this.onLoad.next(false);
      },
    });
  }

  triggerAction(): void {}

  protected onSelectedOperationChange(): void {
    this.onRefresh.next();
    this.loadData();
  }
}
