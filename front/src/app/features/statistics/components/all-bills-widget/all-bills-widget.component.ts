import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseStatsWidgetComponent } from '../base-stats-widget/base-stats-widget.component';
import { IWidget } from '../../../../core/models/statistics/widget';
import { BillsService } from '../../../../core/services/bills/bills.service';
import { Bill } from '../../../../core/models/bills/bill.model';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { TransactionItemComponent } from '../../../../shared/components/transaction-item/transaction-item.component';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollReached } from 'ngx-scrollbar/reached-event';
import { Pagination } from '../../../../core/models/pagination/pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-all-bills-widget',
  imports: [
    CommonModule,
    CustomListComponent,
    TransactionItemComponent,
    NgScrollbarModule,
    NgScrollReached,
    MatProgressSpinnerModule,
  ],
  templateUrl: './all-bills-widget.component.html',
  styleUrl: './all-bills-widget.component.scss',
})
export class AllBillsWidgetComponent extends BaseStatsWidgetComponent implements IWidget, OnInit {
  private readonly billsService = inject(BillsService);
  private readonly appStateStore = inject(AppStateStore);

  readonly bills = signal<Bill[]>([]);

  readonly paginationInfo = signal<{
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }>({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  });

  readonly userCurrency$ = this.appStateStore.userDefaultCurrency$;

  readonly isLoading = signal<boolean>(false);

  isTotalSpending = signal<boolean>(false);

  override ngOnInit() {
    super.ngOnInit();
  }

  pagination = signal<Pagination>({
    page: 0,
    size: 10,
  });

  loadData(loadMore = false): void {
    this.isLoading.set(true);
    this.billsService
      .getBills({
        size: this.pagination().size,
        page: this.pagination().page,
        from: this.timeRange().from.toISO()!,
        to: this.timeRange().to.toISO()!,
      })
      .subscribe({
        next: (bills) => {
          if (loadMore) {
            this.bills.set([...this.bills(), ...bills.content]);
          } else {
            this.bills.set(bills.content);
          }
          this.paginationInfo.set(bills.page);
          this.onLoad.next(true);
          this.isLoading.set(false);
        },
        error: () => {
          this.onLoad.next(false);
          this.isLoading.set(false);
        },
      });
  }

  onScrolledBottom() {
    if (this.paginationInfo().totalPages > this.pagination().page + 1) {
      this.pagination.update((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
      this.loadData(true);
    }
  }

  triggerAction(): void {}
}
