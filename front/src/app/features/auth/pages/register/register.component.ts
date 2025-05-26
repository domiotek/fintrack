import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { RegisterRequest } from '../../../../core/models/auth/register-request.model';
import { CurrencySelectorComponent } from '../../../../shared/components/currency-selector/currency-selector.component';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { PasswordInputComponent } from '../../../../shared/components/password-input/password-input.component';

@Component({
  selector: 'app-register',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    AlertPanelComponent,
    CurrencySelectorComponent,
    FormProgressBarComponent,
    PasswordInputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['../../styles/common.style.scss', './register.component.scss'],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
    name: new FormControl('', { validators: [Validators.required] }),
    surname: new FormControl('', { validators: [Validators.required] }),
    currency: new FormControl('', { validators: [Validators.required] }),
  });

  errorCode = signal<number | null>(null);
  submitting = signal(false);

  authService = inject(AuthService);
  routingService = inject(RoutingService);

  onSubmit() {
    if (!this.registerForm.valid) return;

    this.submitting.set(true);
    const registerData: RegisterRequest = {
      email: this.registerForm.value.email as string,
      password: this.registerForm.value.password as string,
      confirmPassword: this.registerForm.value.repeatPassword as string,
      firstName: this.registerForm.value.name as string,
      lastName: this.registerForm.value.surname as string,
      currencyId: this.registerForm.value.currency as string,
    };

    this.authService.register(registerData).subscribe({
      complete: () => {
        this.routingService.navigate(['/login'], { ref: 'register' });
        this.submitting.set(false);
      },
      error: (err) => {
        this.errorCode.set(err.error?.code);
        this.submitting.set(false);
      },
    });
  }
}
