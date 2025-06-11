import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { CategoryService } from '../../../../core/services/category/category.service';
import { Category } from '../../../../core/models/category/category.model';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';
import { CategoryRequest } from '../../../../core/models/category/category-request';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-manage-category-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    AlertPanelComponent,
    FormProgressBarComponent,
    FormsModule,
  ],
  templateUrl: './manage-category-dialog.component.html',
  styleUrl: './manage-category-dialog.component.scss',
})
export class ManageCategoryDialogComponent implements OnInit {
  protected readonly categoryService = inject(CategoryService);
  private readonly dialogRef = inject(MatDialogRef<ManageCategoryDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly data = inject<Category>(MAT_DIALOG_DATA);

  form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(3)] }),
    color: new FormControl<string | null>(null, { validators: [Validators.required] }),
  });

  errorCode = signal<ApiErrorCode | null>(null);
  submitting = signal<boolean>(false);

  title = signal<string>('Utwórz kategorię');
  submitText = signal<string>('Utwórz');

  ngOnInit(): void {
    if (this.data) {
      this.title.set('Edytuj kategorię');
      this.submitText.set('Zapisz');
      this.form.patchValue({
        name: this.data.name,
        color: this.data.color,
      });
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    if (!this.data) {
      this.handleAddCategory();
      return;
    }

    this.handleUpdateCategory();
  }

  private handleAddCategory(): void {
    this.submitting.set(true);
    const req: CategoryRequest = {
      name: this.form.value.name!,
      color: this.form.value.color!,
    };

    this.categoryService
      .createCategory(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.dialogRef.close(true);
          this.submitting.set(false);
        },
        error: (err) => {
          this.errorCode.set(err.error?.code);
          this.submitting.set(false);
        },
      });
  }

  private handleUpdateCategory(): void {
    this.submitting.set(true);

    const req: CategoryRequest = {
      name: this.form.value.name!,
      color: this.form.value.color!,
    };

    this.categoryService
      .updateCategory(this.data.id, req)
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
