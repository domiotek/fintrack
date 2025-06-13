import { TestBed } from '@angular/core/testing';
import { BaseApiService } from './base-api.service';
import { ApiErrorCode } from '../models/error-codes.enum';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('BaseApiService', () => {
  let service: BaseApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseApiService, provideExperimentalZonelessChangeDetection()],
    });
    service = TestBed.inject(BaseApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getErrorMessage', () => {
    it('should return correct message for invalid email or password (302)', () => {
      const result = service.getErrorMessage(302 as ApiErrorCode);
      expect(result).toBe('Niepoprawny email lub hasło.');
    });

    it('should return correct message for account already exists (303)', () => {
      const result = service.getErrorMessage(303 as ApiErrorCode);
      expect(result).toBe('Takie konto już istnieje.');
    });

    it('should return correct message for invalid verification token (301)', () => {
      const result = service.getErrorMessage(301 as ApiErrorCode);
      expect(result).toBe('Niepoprawny token weryfikacyjny. Sprawdź poprawność linku.');
    });

    it('should return authentication error message for multiple error codes (100, 300, 304)', () => {
      const expectedMessage =
        'Błąd przy próbie uwierzytelnienia. Pomocne może być usunięcie plików cookies i ponowienie operacji.';

      expect(service.getErrorMessage(100 as ApiErrorCode)).toBe(expectedMessage);
      expect(service.getErrorMessage(300 as ApiErrorCode)).toBe(expectedMessage);
      expect(service.getErrorMessage(304 as ApiErrorCode)).toBe(expectedMessage);
    });

    it('should return correct message for incorrect password (310)', () => {
      const result = service.getErrorMessage(310 as ApiErrorCode);
      expect(result).toBe('Niepoprawne hasło.');
    });

    it('should return correct message for self friend invite (601)', () => {
      const result = service.getErrorMessage(601 as ApiErrorCode);
      expect(result).toBe('Nie możesz zaprosić sam siebie do znajomych.');
    });

    it('should return correct message for already friends (602)', () => {
      const result = service.getErrorMessage(602 as ApiErrorCode);
      expect(result).toBe('Jesteście już znajomymi.');
    });

    it('should return default error message for unknown error codes', () => {
      const result = service.getErrorMessage(999 as ApiErrorCode);
      expect(result).toBe('Wystąpił nieznany błąd.');
    });
  });
});
