import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { RoutingService } from '../../../../core/services/routing/routing.service';

@Component({
  selector: 'app-send-reset-password-form',
  imports: [MatFormFieldModule, MatInput, CommonModule, ReactiveFormsModule, MatButtonModule, AlertPanelComponent],
  templateUrl: './send-reset-password-form.component.html',
  styleUrls: ['../../styles/common.style.scss'],
})
export class SendResetPasswordFormComponent {
  resetPasswordForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
  });

  errorCode = signal<number | null>(null);
  @Input({ required: true })
  submitting!: WritableSignal<boolean>;

  authService = inject(AuthService);
  routingService = inject(RoutingService);

  onSubmit() {
    if (!this.resetPasswordForm.valid) return;

    this.errorCode.set(null);
    this.submitting.set(true);

    this.authService.sendPasswordReset(this.resetPasswordForm.value.email!).subscribe({
      error: (err) => {
        this.errorCode.set(err.error.code);
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
        this.routingService.navigate(['/login'], { ref: 'reset-password-sent' });
      },
    });
  }
}
