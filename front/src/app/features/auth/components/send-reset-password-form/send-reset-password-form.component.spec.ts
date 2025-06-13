import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendResetPasswordFormComponent } from './send-reset-password-form.component';
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { of, throwError } from 'rxjs';

describe('SendResetPasswordFormComponent', () => {
  let component: SendResetPasswordFormComponent;
  let fixture: ComponentFixture<SendResetPasswordFormComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRoutingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['sendPasswordReset']);
    mockRoutingService = jasmine.createSpyObj('RoutingService', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SendResetPasswordFormComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: RoutingService, useValue: mockRoutingService },
        AppStateStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SendResetPasswordFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('submitting', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.resetPasswordForm.get('email')?.value).toBe('');
    expect(component.resetPasswordForm.valid).toBeFalsy();
  });

  it('should validate email field as required', () => {
    const emailControl = component.resetPasswordForm.get('email');

    expect(emailControl?.hasError('required')).toBeTruthy();

    emailControl?.setValue('test');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();

    expect(mockAuthService.sendPasswordReset).not.toHaveBeenCalled();
  });
  it('should submit when form is valid', () => {
    mockAuthService.sendPasswordReset.and.returnValue(of(undefined));

    component.resetPasswordForm.get('email')?.setValue('test@example.com');
    component.onSubmit();

    expect(mockAuthService.sendPasswordReset).toHaveBeenCalledWith('test@example.com');
  });
  it('should call sendPasswordReset with correct email', () => {
    // Create a simple observable that completes immediately
    mockAuthService.sendPasswordReset.and.returnValue(of(undefined));

    component.resetPasswordForm.get('email')?.setValue('test@example.com');
    component.submitting.set(false);

    component.onSubmit();

    // Since the observable completes immediately, we can't really test the intermediate state
    // Instead, let's test that the method was called
    expect(mockAuthService.sendPasswordReset).toHaveBeenCalledWith('test@example.com');
  });

  it('should navigate to login on successful submission', () => {
    mockAuthService.sendPasswordReset.and.returnValue(of(undefined));

    component.resetPasswordForm.get('email')?.setValue('test@example.com');
    component.onSubmit();

    expect(mockRoutingService.navigate).toHaveBeenCalledWith(['/login'], { ref: 'reset-password-sent' });
  });

  it('should handle submission error', () => {
    const errorResponse = { error: { code: 404 } };
    mockAuthService.sendPasswordReset.and.returnValue(throwError(() => errorResponse));

    component.resetPasswordForm.get('email')?.setValue('test@example.com');
    component.onSubmit();

    expect(component.errorCode()).toBe(404);
    expect(component.submitting()).toBeFalsy();
  });
  it('should clear error code on new submission', () => {
    component.errorCode.set(404);
    mockAuthService.sendPasswordReset.and.returnValue(of(undefined));

    component.resetPasswordForm.get('email')?.setValue('test@example.com');
    component.onSubmit();

    expect(component.errorCode()).toBeNull();
  });
});
