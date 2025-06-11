import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TimeRangeSelectorComponent } from '../../../../shared/components/time-range-selector/time-range-selector.component';
import { TimeRange } from '../../../../core/models/time-range/time-range';
import { EMPTY_CATEGORY_STATE } from '../../constants/empty-category-state';
import { CategoryStateStore } from '../../store/category-state.store';
import { callDebounced as debounceHandler } from '../../../../utils/debouncer';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateTime } from 'luxon';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { SortMenuComponent } from '../../../../shared/components/sort-menu/sort-menu.component';
import { FormsModule } from '@angular/forms';
import { SortState } from '../../../../core/models/sort/sort-state';
import { SortItem } from '../../../../core/models/sort/sort-item';
import { CATEGORIES_SORT_ITEMS } from '../../constants/categories-sort-items';
import { CATEGORIES_START_SORT_STATE } from '../../constants/categories-start-sort-state';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { CategoryService } from '../../../../core/services/category/category.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Category } from '../../../../core/models/category/category.model';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { CategoryDetailsComponent } from '../../components/category-details/category-details.component';
import { NoSelectedComponent } from '../../../../shared/components/no-selected/no-selected.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { finalize, tap } from 'rxjs';
import { CategoryItemComponent } from '../../../../shared/components/category-item/category-item.component';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { CategoryFilters } from '../../../../core/models/category/category-filters';
import { Pagination } from '../../../../core/models/pagination/pagination';
import { CategoriesApiRequest } from '../../../../core/models/category/get-many.model';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { ManageCategoryDialogComponent } from '../../components/manage-category-dialog/manage-category-dialog.component';

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule,
    TimeRangeSelectorComponent,
    MatButton,
    MatIconModule,
    SearchInputComponent,
    SortMenuComponent,
    FormsModule,
    CustomListComponent,
    CategoryItemComponent,
    AsyncPipe,
    CategoryDetailsComponent,
    NoSelectedComponent,
    SpinnerComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  private readonly appStateStore = inject(AppStateStore);

  private readonly destroyRef = inject(DestroyRef);

  private readonly categoryState = inject(CategoryStateStore);

  private readonly observer = inject(BreakpointObserver);

  private readonly routingService = inject(RoutingService);

  private readonly dialog = inject(MatDialog);

  readonly timeRange = signal<TimeRange>(EMPTY_CATEGORY_STATE.timeRange);

  readonly isMobile = signal<boolean>(false);
  readonly selectedCategory = signal<Category | null>(null);

  readonly isSearching = signal<boolean>(false);

  readonly filters = signal<CategoryFilters>({
    name: null,
    from: '',
    to: '',
  });

  pagination = signal<Pagination>({
    page: 0,
    size: 10,
  });

  projection_range = computed(() => ({
    from: this.timeRange().from.startOf('month'),
    to: this.timeRange().to.endOf('month'),
  }));

  readonly dateLabel = computed(() => {
    const range = this.projection_range();

    if (DateTime.now().hasSame(range.from, 'year')) {
      return range.from.toFormat('LLLL');
    }

    return range.from.toFormat('LLLL yyyy');
  });

  rangeConstraints = computed(() => {
    return {
      max: DateTime.now().endOf('month'),
    };
  });

  readonly searchValue = signal<string>('');

  readonly sortOptions = signal<SortItem[]>(CATEGORIES_SORT_ITEMS);

  readonly sortState = signal<SortState>(CATEGORIES_START_SORT_STATE);

  readonly categories = this.categoryService.getCategories();

  readonly userCurrency$ = this.appStateStore.userDefaultCurrency$;

  ngOnInit(): void {
    this.observer
      .observe('(max-width: 1024px)')
      .pipe(
        tap((res) => {
          this.isMobile.set(res.matches);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.filters.set({
      ...this.filters(),
      from: `${this.timeRange().from.toISO()}`,
      to: `${this.timeRange().to.toISO()}`,
    });

    this.getCategories();

    const routingState = this.routingService.getAndConsumeNavigationState();

    if (routingState['categoryId']) {
      const categoryId = routingState['categoryId'];
      this.selectedCategory.set(this.categories().find((c) => c.id === categoryId) ?? null);
    }

    if (routingState['timeRange']) {
      this.timeRange.set(routingState['timeRange'] as TimeRange);
    }
  }

  onProjectionDateChange = debounceHandler(
    (timeRange: TimeRange) => {
      this.categoryState.setTimeRange(timeRange);
      this.timeRange.set(timeRange);
      this.filters.set({
        ...this.filters(),
        from: `${timeRange.from.toISO()}`,
        to: `${timeRange.to.toISO()}`,
      });

      this.onSearch(this.filters().name ?? '');
    },
    300,
    this.destroyRef,
  );

  onSearch(searchValue: string): void {
    this.filters.set({
      ...this.filters(),
      name: searchValue ?? null,
    });
    this.getCategories();
    this.selectedCategory.set(null);
  }

  onSortChange(state: SortState): void {
    this.sortState.set({ ...state });
    this.getCategories();
  }

  onCategorySelect(category: Category | null): void {
    if (!category) {
      this.selectedCategory.set(null);
      return;
    }
  }

  protected addCategory(): void {
    const dialogRef = this.dialog.open(ManageCategoryDialogComponent, {
      width: '600px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          if (res) {
            this.pagination.set({
              page: 0,
              size: 10,
            });
            this.getCategories();
          }
        }),
      )
      .subscribe();
  }

  protected onCategoryUpdated(action: 'update' | 'deletion'): void {
    if (action === 'deletion') {
      this.selectedCategory.set(null);
      this.pagination.set({
        page: 0,
        size: 10,
      });
      this.selectedCategory.set(null);
      this.getCategories();
    } else {
      const currentCategory = this.selectedCategory();
      this.categories.set(this.categories().map((c) => (c.id === currentCategory?.id ? currentCategory : c)));
    }
  }

  private getCategories(): void {
    this.isSearching.set(true);
    const req: CategoriesApiRequest = {
      name: this.filters().name ?? '',
      from: this.filters().from!,
      to: this.filters().to!,
      page: this.pagination().page,
      size: this.pagination().size,
      sortDirection: this.sortState().direction,
    };

    this.categoryService
      .getCategoriesList(req)
      .pipe(
        finalize(() => this.isSearching.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
