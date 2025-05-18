import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ErrorHolderComponent } from '../../components/error-holder/error-holder.component';
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
    ErrorHolderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required] }),
  });

  loginError = signal(false);
  errorCode = signal(0);

  authService = inject(AuthService);

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.email as string,
        password: this.loginForm.value.password as string,
      };

      this.authService.login(loginData).subscribe({
        next: () => {
          this.loginError.set(false);
        },
        error: (err) => {
          this.loginError.set(true);
          this.errorCode.set(err.error.code);
        },
      });
    }
  }
}
