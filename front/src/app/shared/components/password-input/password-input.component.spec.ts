import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordInputComponent } from './password-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';

describe('PasswordInputComponent', () => {
  let component: PasswordInputComponent;
  let fixture: ComponentFixture<PasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputComponent);
    component = fixture.componentInstance;

    component.parentForm = signal(
      new FormGroup({
        password: new FormControl(),
        repeatPassword: new FormControl(),
      }),
    ) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default password input name', () => {
    expect(component.passwordInputName()).toBe('password');
  });

  it('should have default repeat password input name', () => {
    expect(component.repeatPasswordInputName()).toBe('repeatPassword');
  });
  it('should accept custom input names', () => {
    fixture.componentRef.setInput('passwordInputName', 'customPassword');
    fixture.componentRef.setInput('repeatPasswordInputName', 'customRepeatPassword');

    expect(component.passwordInputName()).toBe('customPassword');
    expect(component.repeatPasswordInputName()).toBe('customRepeatPassword');
  });
  it('should get password control from parent form', () => {
    const control = component.passwordControl;
    expect(control).toBeTruthy();
  });

  it('should get repeat password control from parent form', () => {
    const control = component.repeatPasswordControl;
    expect(control).toBeTruthy();
  });

  it('should validate password as required', () => {
    const passwordControl = component.passwordControl;

    passwordControl.setValue('');
    expect(passwordControl.hasError('required')).toBeTruthy();

    passwordControl.setValue('validPassword123!');
    expect(passwordControl.hasError('required')).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.passwordControl;

    passwordControl.setValue('short');
    expect(passwordControl.hasError('minlength')).toBeTruthy();

    passwordControl.setValue('ValidPassword123!');
    expect(passwordControl.hasError('minlength')).toBeFalsy();
  });

  it('should validate password pattern', () => {
    const passwordControl = component.passwordControl;

    // Missing uppercase
    passwordControl.setValue('invalidpassword123!');
    expect(passwordControl.hasError('pattern')).toBeTruthy();

    // Missing special character
    passwordControl.setValue('InvalidPassword123');
    expect(passwordControl.hasError('pattern')).toBeTruthy();

    // Valid password
    passwordControl.setValue('ValidPassword123!');
    expect(passwordControl.hasError('pattern')).toBeFalsy();
  });

  it('should validate password confirmation match', () => {
    const passwordControl = component.passwordControl;
    const repeatControl = component.repeatPasswordControl;

    passwordControl.setValue('ValidPassword123!');
    repeatControl.setValue('DifferentPassword123!');

    expect(repeatControl.hasError('passwordMismatch')).toBeTruthy();

    repeatControl.setValue('ValidPassword123!');
    expect(repeatControl.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should return correct error message', () => {
    const passwordControl = component.passwordControl;

    passwordControl.setValue('');
    expect(component.getError(passwordControl)).toBe('Hasło jest wymagane');

    passwordControl.setValue('short');
    expect(component.getError(passwordControl)).toBe('Hasło musi posiadać conajmniej 8 znaków');
  });

  it('should return null when no error', () => {
    const passwordControl = component.passwordControl;

    passwordControl.setValue('ValidPassword123!');
    expect(component.getError(passwordControl)).toBeNull();
  });
});
