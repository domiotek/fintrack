import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { IWidget } from '../../../models/widget';
import { skip } from 'rxjs';
import { BaseWidgetComponent } from '../../base-widget/base-widget/base-widget.component';
import { RoutingService } from '../../../../../core/services/routing/routing.service';
import { DashboardStateStore } from '../../../store/dashboard-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-spending-summary-widget',
  imports: [],
  templateUrl: './spending-summary-widget.component.html',
  styleUrl: './spending-summary-widget.component.scss',
})
export class SpendingSummaryWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
  routingService = inject(RoutingService);
  dashboardStore = inject(DashboardStateStore);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.onInit.next({
      hasInteraction: false,
    });

    this.dashboardStore.timeRange$.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe((timeRange) => {
      this.timeRange.set(timeRange);
      this.onRefresh.next();

      setTimeout(() => {
        this.onLoad.next();
      }, 1000);
    });

    setTimeout(() => {
      this.onLoad.next();
    }, 1000);
  }

  override triggerAction(): void {}
}
