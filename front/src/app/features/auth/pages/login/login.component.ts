import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { FormProgressBarComponent } from '../../components/form-progress-bar/form-progress-bar.component';
@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInput,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    AlertPanelComponent,
    FormProgressBarComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../styles/common.style.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required] }),
  });

  errorCode = signal<number | null>(null);
  submitting = signal(false);
  prevPage = signal<'register' | 'reset-password-sent' | 'reset-password' | 'account-activated' | null>(null);

  authService = inject(AuthService);
  routingService = inject(RoutingService);

  ngOnInit(): void {
    const referral = this.routingService.getAndConsumeNavigationState()['ref'];

    switch (referral) {
      case 'register':
      case 'reset-password-sent':
      case 'reset-password':
      case 'account-activated':
        this.prevPage.set(referral);
        break;
    }
  }

  onSubmit() {
    if (!this.loginForm.valid) return;

    this.errorCode.set(null);
    this.submitting.set(true);

    const loginData = {
      email: this.loginForm.value.email as string,
      password: this.loginForm.value.password as string,
    };

    this.authService.login(loginData).subscribe({
      error: (err) => {
        this.errorCode.set(err.error.code);
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
      },
    });
  }
}
