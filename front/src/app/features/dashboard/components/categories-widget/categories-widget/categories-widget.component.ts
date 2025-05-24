import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { skip } from 'rxjs';
import { IWidget } from '../../../models/widget';
import { RoutingService } from '../../../../../core/services/routing/routing.service';
import { BaseWidgetComponent } from '../../base-widget/base-widget/base-widget.component';
import { DashboardStateStore } from '../../../store/dashboard-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-categories-widget',
  imports: [],
  templateUrl: './categories-widget.component.html',
  styleUrl: './categories-widget.component.scss',
})
export class CategoriesWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
  routingService = inject(RoutingService);
  dashboardStore = inject(DashboardStateStore);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.onInit.next({
      hasInteraction: true,
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

  override triggerAction(): void {
    this.routingService.navigate(['/categories']);
  }
}
