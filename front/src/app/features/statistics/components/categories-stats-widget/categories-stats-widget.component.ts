import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseStatsWidgetComponent } from '../base-stats-widget/base-stats-widget.component';
import { IWidget } from '../../../../core/models/statistics/widget';
import { Stats } from '../../../../core/models/statistics/stats.model';
import { StatisticsService } from '../../../../core/services/statistics/statistics.service';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { BarChartComponent } from '../../../../shared/components/bar-chart/bar-chart.component';
import { CommonModule } from '@angular/common';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';

@Component({
  selector: 'app-categories-stats-widget',
  imports: [CommonModule, BarChartComponent, NoDataComponent],
  templateUrl: './categories-stats-widget.component.html',
  styleUrl: './categories-stats-widget.component.scss',
})
export class CategoriesStatsWidgetComponent extends BaseStatsWidgetComponent implements IWidget, OnInit {
  private readonly statisticsService = inject(StatisticsService);
  private readonly appStateStore = inject(AppStateStore);

  readonly data = signal<Stats | null>(null);

  readonly totalSpendingData = signal<Stats | null>(null);

  readonly userCurrency$ = this.appStateStore.userDefaultCurrency$;

  isTotalSpending = signal<boolean>(false);

  override ngOnInit() {
    super.ngOnInit();
  }

  loadData(): void {
    this.statisticsService
      .getCategoriesStats({ from: this.timeRange().from.toISO()!, to: this.timeRange().to.toISO()! })
      .subscribe({
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
}
