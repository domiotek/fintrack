import { Component, inject, OnInit, signal } from '@angular/core';
import { IWidget } from '../../models/widget';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { StatisticsService } from '../../../../core/services/statistics/statistics.service';
import { DashboardStats } from '../../../../core/models/statistics/dashboard-stats';
import { LineChartComponent } from '../../../../shared/components/line-chart/line-chart.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { AppStateStore } from '../../../../core/store/app-state.store';
@Component({
  selector: 'app-spending-summary-widget',
  imports: [CommonModule, LineChartComponent, MatIconModule, NoDataComponent],
  templateUrl: './spending-summary-widget.component.html',
  styleUrl: './spending-summary-widget.component.scss',
})
export class SpendingSummaryWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
  private readonly statisticsService = inject(StatisticsService);
  private readonly appStateStore = inject(AppStateStore);

  readonly data = signal<DashboardStats | null>(null);

  readonly userCurrency$ = this.appStateStore.userDefaultCurrency$;

  override ngOnInit() {
    this.onInit.next({
      hasInteraction: false,
    });

    super.ngOnInit();
  }

  loadData(): void {
    this.statisticsService
      .getDashboardStats({
        from: this.timeRange().from.toISO()!,
        to: this.timeRange().to.toISO()!,
      })
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
