import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInput,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    AlertPanelComponent,
    MatProgressBarModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../../styles/common.style.scss'],
})
export class ResetPasswordComponent {
  resetPasswordForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
  });

  errorCode = signal<number | null>(null);
  submitting = signal(false);

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
        this.routingService.navigate(['/login'], { ref: 'reset-password' });
      },
    });
  }
}
