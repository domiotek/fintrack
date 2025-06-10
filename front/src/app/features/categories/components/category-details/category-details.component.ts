import { BillsService } from './../../../../core/services/bills/bills.service';
import { Component, DestroyRef, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { Category } from '../../../../core/models/category/category.model';
import { CommonModule } from '@angular/common';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Bill } from '../../../../core/models/bills/bill.model';
import { TransactionItemComponent } from '../../../../shared/components/transaction-item/transaction-item.component';
import { Currency } from '../../../../core/models/currency/currency.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TimeRangeReq } from '../../../../core/models/time-range/time-range-req';
import { BillsApiRequest } from '../../../../core/models/bills/get-many.model';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, CustomListComponent, TransactionItemComponent, MatButtonModule, MatIconModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss',
})
export class CategoryDetailsComponent implements OnInit, OnChanges {
  private readonly billsService = inject(BillsService);

  private readonly destroyRef = inject(DestroyRef);

  readonly category = input.required<Category>();

  readonly userCurrency = input.required<Currency>();

  readonly isMobile = input.required<boolean>();

  readonly date = input.required<TimeRangeReq>();

  readonly goBackEmit = output<void>();

  readonly sameMonth = signal<boolean>(true);

  readonly transactions = signal<Bill[]>([]);

  ngOnInit(): void {
    this.getCategoryBills();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && !changes['category'].firstChange) {
      this.getCategoryBills();
    }
  }

  protected changeLimit(isExists: boolean): void {
    console.log('Change limit', isExists);
  }

  protected goBack(): void {
    this.goBackEmit.emit();
  }

  private getCategoryBills(): void {
    const req: BillsApiRequest = {
      categoryId: this.category().id,
      from: this.date().from,
      to: this.date().to,
    };

    this.billsService
      .getBills(req)
      .pipe(
        tap((res) => {
          this.transactions.set(res.content);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
