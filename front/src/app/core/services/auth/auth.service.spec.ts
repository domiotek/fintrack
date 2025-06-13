import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AppStateStore } from '../../store/app-state.store';
import { provideHttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { LoginRequest } from '../../models/auth/login-request.model';
import { RegisterRequest } from '../../models/auth/register-request.model';
import { ConfigResponse } from '../../models/auth/config-response.model';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let appStateStore: jasmine.SpyObj<AppStateStore>;
  let configService: jasmine.SpyObj<ConfigService>;

  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(async () => {
    const appStateStoreSpy = jasmine.createSpyObj('AppStateStore', ['logout']);
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);

    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AppStateStore, useValue: appStateStoreSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    appStateStore = TestBed.inject(AppStateStore) as jasmine.SpyObj<AppStateStore>;
    configService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should call login endpoint and then get config', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockConfig: ConfigResponse = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        currency: { id: 1, name: 'USD', code: '$', rate: 1 },
      };

      configService.getConfig.and.returnValue(of(mockConfig));

      service.login(loginRequest).subscribe((result) => {
        expect(result).toEqual(mockConfig);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(null);

      expect(configService.getConfig).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should call register endpoint with registration data', () => {
      const registerRequest: RegisterRequest = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        currencyId: '1',
      };

      service.register(registerRequest).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(null);
    });
  });

  describe('refresh', () => {
    it('should call refresh endpoint', () => {
      service.refresh().subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });

  describe('logout', () => {
    it('should call logout endpoint and clear app state', () => {
      service.logout().subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(null);

      expect(appStateStore.logout).toHaveBeenCalled();
    });
  });

  describe('sendPasswordReset', () => {
    it('should call send password reset endpoint with email', () => {
      const email = 'test@example.com';

      service.sendPasswordReset(email).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/send-password-reset`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(null);
    });
  });

  describe('resetPassword', () => {
    it('should call password reset confirm endpoint with token and new password', () => {
      const token = 'reset-token-123';
      const newPassword = 'newPassword123';

      service.resetPassword(token, newPassword).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/password-reset/confirm`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token, newPassword });
      req.flush(null);
    });
  });

  describe('activateAccount', () => {
    it('should call activate endpoint with token', () => {
      const token = 'activation-token-123';

      service.activateAccount(token).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/activate`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token });
      req.flush(null);
    });
  });

  describe('error handling', () => {
    it('should inherit getErrorMessage from BaseApiService', () => {
      expect(service.getErrorMessage).toBeDefined();
      expect(service.getErrorMessage(302)).toBe('Niepoprawny email lub hasło.');
    });
  });
});
