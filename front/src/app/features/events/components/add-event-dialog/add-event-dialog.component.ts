import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencySelectorComponent } from '../../../../shared/components/currency-selector/currency-selector.component';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { MatSelectModule } from '@angular/material/select';
import { EventsService } from '../../../../core/services/events/events.service';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { DateTime } from 'luxon';
import { Currency } from '../../../../core/models/currency/currency.model';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateEventRequest } from '../../../../core/models/events/create-event-request';
import { Event, EventDetails } from '../../../../core/models/events/event';
import { UpdateEventRequest } from '../../../../core/models/events/update-event-request';

@Component({
  selector: 'app-add-event-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    CurrencySelectorComponent,
    AlertPanelComponent,
    MatDatepickerModule,
    FormProgressBarComponent,
    MatSelectModule,
  ],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss',
})
export class AddEventDialogComponent implements OnInit {
  protected readonly eventsService = inject(EventsService);
  private readonly dialogRef = inject(MatDialogRef<AddEventDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly appStateStore = inject(AppStateStore);
  protected readonly data = inject<EventDetails>(MAT_DIALOG_DATA);

  form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(3)] }),
    startDate: new FormControl<string>(DateTime.now().toISODate(), Validators.required),
    endDate: new FormControl<string>(DateTime.now().toISODate(), Validators.required),
    currencyId: new FormControl<number>(0, { validators: [Validators.required] }),
    usersIds: new FormControl<number[]>([], { validators: [Validators.required] }),
  });

  currencies = signal<Currency[]>([]);
  errorCode = signal<ApiErrorCode | null>(null);
  submitting = signal<boolean>(false);

  title = signal<string>('Dodaj wydarzenie');
  submitText = signal<string>('Dodaj');

  ngOnInit(): void {
    this.appStateStore.appState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.form.patchValue({
        currencyId: state.currency?.id,
      });
      this.currencies.set(state.currencyList ?? []);
    });

    if (this.data) {
      this.title.set('Edytuj wydarzenie');
      this.submitText.set('Zapisz');
      this.form.patchValue({
        name: this.data.name,
        currencyId: this.data.currency.id,
        startDate: DateTime.fromISO(this.data.startDate).toISODate(),
        endDate: DateTime.fromISO(this.data.endDate).toISODate(),
      });
    }

    // tymczasowo dopóki nie ma friendsów
    this.form.patchValue({
      usersIds: [1, 2, 3],
    });
  }

  dateFilter(date: DateTime | null): boolean {
    if (!date) return false;
    const today = DateTime.now();
    return date >= today.startOf('month') && date <= today;
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    if (!this.data) {
      this.handleCreateEvent();
      return;
    }

    this.handleUpdateEvent();
  }

  private handleUpdateEvent(): void {
    this.submitting.set(true);

    const eventData: UpdateEventRequest = {
      name: this.form.value.name!,
      startDate: DateTime.fromISO(this.form.value.startDate!).toISO()!,
      endDate: DateTime.fromISO(this.form.value.endDate!).toISO()!,
      currencyId: this.form.value.currencyId!,
    };

    this.eventsService.updateEvent(this.data.id, eventData).subscribe({
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

  private handleCreateEvent(): void {
    this.submitting.set(true);
    const eventData: CreateEventRequest = {
      name: this.form.value.name!,
      startDate: DateTime.fromISO(this.form.value.startDate!).toISO()!,
      endDate: DateTime.fromISO(this.form.value.endDate!).toISO()!,
      currencyId: this.form.value.currencyId!,
      usersIds: this.form.value.usersIds!,
    };

    this.eventsService.createEvent(eventData).subscribe({
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
}
