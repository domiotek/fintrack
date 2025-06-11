import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { CategoryService } from '../../../../core/services/category/category.service';
import { LimitRequest } from '../../../../core/models/category/limit-request';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';
import { Category } from '../../../../core/models/category/category.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-manage-limit-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    AlertPanelComponent,
    FormProgressBarComponent,
  ],
  templateUrl: './manage-limit-dialog.component.html',
  styleUrl: './manage-limit-dialog.component.scss',
})
export class ManageLimitDialogComponent implements OnInit {
  protected readonly categoryService = inject(CategoryService);
  private readonly dialogRef = inject(MatDialogRef<ManageLimitDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly data = inject<Category>(MAT_DIALOG_DATA);

  limit = signal<number>(0);

  errorCode = signal<ApiErrorCode | null>(null);
  submitting = signal<boolean>(false);

  title = signal<string>('Utwórz limit');
  submitText = signal<string>('Utwórz');

  ngOnInit(): void {
    if (this.data.limit) {
      this.title.set('Edytuj limit');
      this.submitText.set('Zapisz');
      this.limit.set(this.data.limit || 0);
    }
  }

  onSubmit(): void {
    if (this.limit() === null) return;

    this.submitting.set(true);
    const req: LimitRequest = {
      amount: this.limit(),
    };

    this.categoryService
      .addLimit(this.data.id, req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.dialogRef.close(req);
          this.submitting.set(false);
        },
        error: (err) => {
          this.errorCode.set(err.error?.code);
          this.submitting.set(false);
        },
      });
  }
}
