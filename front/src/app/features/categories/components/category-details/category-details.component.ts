import { BillsService } from './../../../../core/services/bills/bills.service';
import {
  Component,
  DestroyRef,
  inject,
  input,
  model,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Category } from '../../../../core/models/category/category.model';
import { CommonModule } from '@angular/common';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Bill } from '../../../../core/models/bills/bill.model';
import { TransactionItemComponent } from '../../../../shared/components/transaction-item/transaction-item.component';
import { Currency } from '../../../../core/models/currency/currency.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TimeRangeReq } from '../../../../core/models/time-range/time-range-req';
import { BillsApiRequest } from '../../../../core/models/bills/get-many.model';
import { MatDialog } from '@angular/material/dialog';
import { ManageCategoryDialogComponent } from '../manage-category-dialog/manage-category-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../../../core/models/dialog/confirmation-dialog-data';
import { CategoryService } from '../../../../core/services/category/category.service';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, CustomListComponent, TransactionItemComponent, MatButtonModule, MatIconModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss',
})
export class CategoryDetailsComponent implements OnInit, OnChanges {
  private readonly billsService = inject(BillsService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly dialog = inject(MatDialog);

  private readonly categoryService = inject(CategoryService);

  readonly category = model.required<Category | null>();

  readonly userCurrency = input.required<Currency>();

  readonly isMobile = input.required<boolean>();

  readonly date = input.required<TimeRangeReq>();

  readonly goBackEmit = output<void>();

  readonly categoryUpdated = output<'update' | 'deletion'>();

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

  protected editCategory(): void {
    const dialogRef = this.dialog.open(ManageCategoryDialogComponent, {
      width: '600px',
      data: this.category(),
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          if (res) {
            this.category.set({ ...this.category()!, name: res.name, color: res.color });
            this.categoryUpdated.emit('update');
          }
        }),
      )
      .subscribe();
  }

  protected deleteCategory(): void {
    const req: ConfirmationDialogData = {
      title: 'Usuń kategorię',
      message: `Czy na pewno chcesz usunąć kategorię "${this.category()?.name}"?`,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: req,
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((res) => {
          if (res) {
            return this.categoryService
              .deleteCategory(this.category()!.id)
              .pipe(tap(() => this.categoryUpdated.emit('deletion')));
          }
          return [];
        }),
      )
      .subscribe();
  }

  private getCategoryBills(): void {
    const req: BillsApiRequest = {
      categoryId: this.category()!.id,
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
