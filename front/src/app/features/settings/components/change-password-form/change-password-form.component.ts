import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PasswordInputComponent } from '../../../../shared/components/password-input/password-input.component';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../../../../core/services/settings/settings.service';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';

@Component({
  selector: 'app-change-password-form',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    PasswordInputComponent,
    FormProgressBarComponent,
    AlertPanelComponent,
  ],
  templateUrl: './change-password-form.component.html',
  styleUrl: '../../styles/common-forms.scss',
})
export class ChangePasswordFormComponent {
  readonly errorCode = signal<ApiErrorCode | null>(null);
  readonly submitting = signal<boolean>(false);
  readonly form = new FormGroup({
    oldPassword: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
  });

  readonly settingsService = inject(SettingsService);
  readonly snackBar = inject(MatSnackBar);

  onSubmit() {
    if (!this.form.valid) return;

    this.errorCode.set(null);
    this.submitting.set(true);

    this.settingsService.updateUserPassword(this.form.value.oldPassword!, this.form.value.password!).subscribe({
      error: (err) => {
        this.errorCode.set(err.error?.code);
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
        this.snackBar.open('Hasło zostało zmienione!', 'Zamknij', { duration: 1200 });
      },
    });
  }
}
