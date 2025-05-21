import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PasswordInputComponent } from '../../../../shared/components/password-input/password-input.component';

@Component({
  selector: 'app-reset-password-form',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, AlertPanelComponent, PasswordInputComponent],
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['../../styles/common.style.scss'],
})
export class ResetPasswordFormComponent {
  resetPasswordForm = new FormGroup({
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
  });

  errorCode = signal<number | null>(null);

  @Input({ required: true })
  submitting!: WritableSignal<boolean>;

  @Input({ required: true })
  token!: string;

  authService = inject(AuthService);
  routingService = inject(RoutingService);

  onSubmit() {
    if (!this.resetPasswordForm.valid) return;

    this.errorCode.set(null);
    this.submitting.set(true);

    this.authService.resetPassword(this.token, this.resetPasswordForm.value.password!).subscribe({
      error: (err) => {
        this.errorCode.set(err.error.code);
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
        this.routingService.navigate(['/login'], { ref: 'reset-password' });
      },
    });
  }
}
