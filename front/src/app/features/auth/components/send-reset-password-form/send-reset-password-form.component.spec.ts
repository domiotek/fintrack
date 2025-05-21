import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendResetPasswordFormComponent } from './send-reset-password-form.component';
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';

describe('SendResetPasswordFormComponent', () => {
  let component: SendResetPasswordFormComponent;
  let fixture: ComponentFixture<SendResetPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendResetPasswordFormComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        AuthService,
        AppStateStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SendResetPasswordFormComponent);
    component = fixture.componentInstance;
    component.submitting = signal(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
