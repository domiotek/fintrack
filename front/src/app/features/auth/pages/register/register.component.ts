import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { ErrorHolderComponent } from '../../components/error-holder/error-holder.component';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { RegisterRequest } from '../../../../core/models/auth/register-request.model';

@Component({
  selector: 'app-register',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInput,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    ErrorHolderComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required] }),
    repeatPassword: new FormControl('', {
      validators: [
        Validators.required,
        (control) => {
          const password = control.parent?.get('password')?.value;
          const repeatPassword = control.value;
          return password === repeatPassword ? null : { passwordMismatch: true };
        },
      ],
    }),
    name: new FormControl('', { validators: [Validators.required] }),
    surname: new FormControl('', { validators: [Validators.required] }),
    currency: new FormControl('', { validators: [Validators.required] }),
  });

  registerError = signal(false);
  errorCode = signal(0);

  authService = inject(AuthService);

  onSubmit() {
    if (this.registerForm.valid) {
      const registerData: RegisterRequest = {
        email: this.registerForm.value.email as string,
        password: this.registerForm.value.password as string,
        confirmPassword: this.registerForm.value.repeatPassword as string,
        firstName: this.registerForm.value.name as string,
        lastName: this.registerForm.value.surname as string,
        currency: this.registerForm.value.currency as string,
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          this.registerError.set(false);
        },
        error: (err) => {
          this.registerError.set(true);
          this.errorCode.set(err.error.code);
          console.log(err);
        },
      });
    }
  }
}
