import { ApiErrorCode } from '../models/error-codes.enum';

export class BaseApiService {
  getErrorMessage(errorCode: ApiErrorCode): string {
    switch (errorCode) {
      case 302:
        return 'Niepoprawny email lub hasło.';
      case 303:
        return 'Takie konto już istnieje.';
      case 301:
        return 'Niepoprawny token weryfikacyjny. Sprawdź poprawność linku.';
      case 100:
      case 300:
      case 304:
        return 'Błąd przy próbie uwierzytelnienia. Pomocne może być usunięcie plików cookies i ponowienie operacji.';
      case 601:
        return 'Nie możesz zaprosić sam siebie do znajomych.';
      case 602:
        return 'Jesteście już znajomymi.';
      default:
        return 'Wystąpił nieznany błąd.';
    }
  }
}
