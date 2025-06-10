import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseStatsWidgetComponent } from '../base-stats-widget/base-stats-widget.component';
import { IWidget } from '../../../../core/models/statistics/widget';
import { StatisticsService } from '../../../../core/services/statistics/statistics.service';
import { Stats } from '../../../../core/models/statistics/stats.model';
import { StatsGroup, StatsGroupsType } from '../../../../core/models/statistics/stats-groups';
import { GroupedStatsRequest } from '../../../../core/models/statistics/grouped-stats-request';
import { SelectGroupingComponent } from '../select-grouping/select-grouping.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { BarChartComponent } from '../../../../shared/components/bar-chart/bar-chart.component';

@Component({
  selector: 'app-transactions-stats-widget',
  imports: [SelectGroupingComponent, NoDataComponent, BarChartComponent],
  templateUrl: './transactions-stats-widget.component.html',
  styleUrl: './transactions-stats-widget.component.scss',
})
export class TransactionsStatsWidgetComponent extends BaseStatsWidgetComponent implements IWidget, OnInit {
  private readonly statisticsService = inject(StatisticsService);

  readonly data = signal<Stats | null>(null);

  filters = signal<StatsGroupsType>(StatsGroup.DAY);

  override ngOnInit() {
    super.ngOnInit();
  }

  loadData(): void {
    const req: GroupedStatsRequest = {
      from: this.timeRange().from.toISO()!,
      to: this.timeRange().to.toISO()!,
      group: this.filters(),
    };

    this.statisticsService.getTransactionsStats(req).subscribe({
      next: (stats) => {
        this.data.set(stats);
        this.onLoad.next(true);
      },
      error: () => {
        this.onLoad.next(false);
      },
    });
  }

  triggerAction(): void {}

  protected onSelectedGroupChange(): void {
    this.onRefresh.next();
    this.loadData();
  }
}
