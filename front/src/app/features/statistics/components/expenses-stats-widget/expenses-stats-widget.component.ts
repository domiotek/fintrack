import { StatsGroup, StatsGroupsType } from './../../../../core/models/statistics/stats-groups';
import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseStatsWidgetComponent } from '../base-stats-widget/base-stats-widget.component';
import { IWidget } from '../../../../core/models/statistics/widget';
import { StatisticsService } from '../../../../core/services/statistics/statistics.service';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { Stats } from '../../../../core/models/statistics/stats.model';
import { GroupedStatsRequest } from '../../../../core/models/statistics/grouped-stats-request';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from '../../../../shared/components/line-chart/line-chart.component';
import { BarChartComponent } from '../../../../shared/components/bar-chart/bar-chart.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { SelectGroupingComponent } from '../select-grouping/select-grouping.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';

@Component({
  selector: 'app-expenses-stats-widget',
  imports: [
    CommonModule,
    LineChartComponent,
    BarChartComponent,
    MatSlideToggleModule,
    FormsModule,
    SelectGroupingComponent,
    NoDataComponent,
  ],
  templateUrl: './expenses-stats-widget.component.html',
  styleUrl: './expenses-stats-widget.component.scss',
})
export class ExpensesStatsWidgetComponent extends BaseStatsWidgetComponent implements IWidget, OnInit {
  private readonly statisticsService = inject(StatisticsService);
  private readonly appStateStore = inject(AppStateStore);

  readonly data = signal<Stats | null>(null);

  readonly totalSpendingData = signal<Stats | null>(null);

  readonly userCurrency$ = this.appStateStore.userDefaultCurrency$;

  filters = signal<StatsGroupsType>(StatsGroup.DAY);

  isTotalSpending = signal<boolean>(false);

  override ngOnInit() {
    super.ngOnInit();
  }

  loadData(): void {
    const req: GroupedStatsRequest = {
      from: this.timeRange().from.toISO()!,
      to: this.timeRange().to.toISO()!,
      group: this.filters(),
    };

    this.statisticsService.getExpensesStats(req).subscribe({
      next: (stats) => {
        this.data.set(stats);

        this.totalSpendingData.set({
          labels: stats.labels,
          data: this.getCumulativeSpending(stats),
        });

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

  private getCumulativeSpending(stats: Stats): number[] {
    return stats.data.reduce((acc: number[], curr: number, idx: number) => {
      acc.push((acc[idx - 1] || 0) + curr);
      return acc;
    }, []);
  }
}
