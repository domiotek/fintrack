import { AppStateStore } from './../../store/app-state.store';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginRequest } from '../../models/auth/login-request.model';
import { ConfigResponse } from '../../models/auth/config-response.model';
import { ConfigService } from '../config/config.service';
import { RegisterRequest } from '../../models/auth/register-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly http = inject(HttpClient);

  private readonly appStateStore = inject(AppStateStore);

  private readonly configService = inject(ConfigService);

  login(credentials: LoginRequest): Observable<ConfigResponse> {
    return this.http.post<void>(`${this.apiUrl}/login`, credentials).pipe(
      switchMap(() => {
        return this.configService.getConfig();
      }),
    );
  }

  register(registrationData: RegisterRequest) {
    return this.http.post<void>(`${this.apiUrl}/register`, registrationData);
  }

  refresh(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/refresh`, {});
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(tap(() => this.appStateStore.logout()));
  }

  getErrorMessage(errorCode: number): string {
    switch (errorCode) {
      case 302:
        return 'Niepoprawny email lub hasło';
      case 303:
        return 'Takie konto już istnieje';
      case 100:
      case 300:
      case 301:
      case 304:
        return 'Błąd przy próbie uwierzytelnienia. Pomocne może być usunięcie plików cookies i ponowienie operacji';
      default:
        return 'Wystąpił nieznany błąd';
    }
  }
}
