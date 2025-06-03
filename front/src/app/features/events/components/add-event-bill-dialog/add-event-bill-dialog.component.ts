import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { DateTime } from 'luxon';
import { EventsService } from '../../../../core/services/events/events.service';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';
import { AddEventBillDialogData } from '../../models/add-event-bill-dialog-data';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { AddBillEventRequest } from '../../../../core/models/events/add-bill-event-request';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';

@Component({
  selector: 'app-add-event-bill-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTimepickerModule,
    FormProgressBarComponent,
    AlertPanelComponent,
  ],
  templateUrl: './add-event-bill-dialog.component.html',
  styleUrl: './add-event-bill-dialog.component.scss',
})
export class AddEventBillDialogComponent implements OnInit {
  protected readonly eventsService = inject(EventsService);
  private readonly dialogRef = inject(MatDialogRef<AddEventBillDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly data = inject<AddEventBillDialogData>(MAT_DIALOG_DATA);

  errorCode = signal<ApiErrorCode | null>(null);
  submitting = signal<boolean>(false);

  form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(3)] }),
    date: new FormControl<string>(DateTime.now().toISODate(), Validators.required),
    time: new FormControl<string>(DateTime.now().toFormat('HH:mm'), Validators.required),
    amount: new FormControl<number>(0, { validators: [Validators.required, Validators.min(0.01)] }),
  });

  get amountInotherCurrencyText(): string {
    const amount = this.form.value.amount;
    const eventCurrency = this.data.eventCurrency;
    const userCurrency = this.data.userCurrency;

    if (amount == null || eventCurrency.id === userCurrency.id) {
      return '';
    }

    const convertedAmount = amount * (userCurrency.rate / eventCurrency.rate);

    return convertedAmount.toFixed(2);
  }

  ngOnInit(): void {
    console.log('Data', this.data);
  }

  protected dateFilter(date: DateTime | null): boolean {
    if (!date) return false;
    const today = DateTime.now();
    return date >= today.startOf('month') && date <= today;
  }

  protected onSubmit() {
    if (!this.form.valid) return;

    const date = DateTime.fromISO(this.form.value.date!);
    const time = DateTime.fromISO(this.form.value.time!);

    const dateTime = date.set({
      hour: time.hour,
      minute: time.minute,
    });

    this.submitting.set(true);
    const req: AddBillEventRequest = {
      name: this.form.value.name!,
      date: dateTime.toISO()!,
      amount: this.form.value.amount!,
      categoryId: 1,
      paidById: 1,
    };

    this.eventsService
      .addBillToEvent(this.data.eventId, req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.eventsService.emitBIllRefresh();
          this.dialogRef.close();
          this.submitting.set(false);
        },
        error: (err) => {
          this.errorCode.set(err.error?.code);
          this.submitting.set(false);
        },
      });
  }
}
