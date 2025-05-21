import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../store/app-state.store';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        AppStateStore,
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
