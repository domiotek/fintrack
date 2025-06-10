import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CurrencySelectorComponent } from '../../../../shared/components/currency-selector/currency-selector.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../../core/services/settings/settings.service';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-personal-info-form',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CurrencySelectorComponent,
    MatInputModule,
    MatButtonModule,
    FormProgressBarComponent,
    AlertPanelComponent,
  ],
  templateUrl: './personal-info-form.component.html',
  styleUrl: '../../styles/common-forms.scss',
})
export class PersonalInfoFormComponent implements OnInit {
  readonly email = input<string>();
  readonly firstName = model<string>();
  readonly lastName = model<string>();
  readonly currency = input<number>(0);

  readonly errorCode = signal<ApiErrorCode | null>(null);
  readonly submitting = signal<boolean>(false);
  readonly form = new FormGroup({
    email: new FormControl(
      { value: this.email(), disabled: true },
      { validators: [Validators.required, Validators.email] },
    ),
    firstName: new FormControl(this.firstName(), { validators: [Validators.required, Validators.minLength(2)] }),
    lastName: new FormControl(this.lastName(), { validators: [Validators.required, Validators.minLength(2)] }),
    currency: new FormControl<number>(this.currency(), { validators: [Validators.required] }),
  });

  readonly settingsService = inject(SettingsService);
  readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.form.patchValue({
      email: this.email(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      currency: this.currency(),
    });
  }

  onSubmit() {
    if (!this.form.valid) return;

    this.errorCode.set(null);
    this.submitting.set(true);

    this.settingsService
      .updateUserPersonalInfo(this.form.value.firstName!, this.form.value.lastName!, this.form.value.currency!)
      .subscribe({
        error: (err) => {
          this.errorCode.set(err.error?.code);
          this.submitting.set(false);
        },
        complete: () => {
          this.submitting.set(false);
          this.snackBar.open('Dane zostały zaktualizowane', 'Zamknij', { duration: 1200 });
          this.firstName.set(this.form.value.firstName!);
          this.lastName.set(this.form.value.lastName!);
        },
      });
  }
}
