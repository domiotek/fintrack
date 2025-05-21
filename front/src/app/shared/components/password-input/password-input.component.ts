import { Component, computed, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['../../../features/auth/styles/common.style.scss', './password-input.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInput],
})
export class PasswordInputComponent implements OnInit {
  parentForm = input<FormGroup>();
  passwordInputName = input<string>('password');
  repeatPasswordInputName = input<string>('repeatPassword');

  get passwordControl(): FormControl {
    return this.parentForm()?.get(this.passwordInputName()) as FormControl;
  }

  get repeatPasswordControl(): FormControl {
    return this.parentForm()?.get(this.repeatPasswordInputName()) as FormControl;
  }

  errorMessageMap = computed(() => {
    return [
      ['required', 'Hasło jest wymagane'],
      ['minlength', 'Hasło musi posiadać conajmniej 8 znaków'],
      ['pattern', 'Hasło musi posiadać małą i wielką literę, cyfrę oraz znak specjalny'],
      ['passwordMismatch', 'Hasła różnią się'],
    ];
  });

  ngOnInit(): void {
    this.passwordControl.addValidators([
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        // eslint-disable-next-line max-len
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+[\]{};:'",<>.?/])[A-Za-z\d!@#$%^&*()\-=_+[\]{};:'",<>.?/]+$/,
      ),
    ]);

    this.repeatPasswordControl.addValidators([
      Validators.required,
      (control) => {
        const password = control.parent?.get('password')?.value;
        const repeatPassword = control.value;
        return password === repeatPassword ? null : { passwordMismatch: true };
      },
    ]);
  }

  getError(control: FormControl): string | null {
    return this.errorMessageMap().find(([key]) => control.errors?.[key])?.[1] ?? null;
  }
}
