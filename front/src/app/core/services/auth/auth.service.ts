import { AppStateStore } from './../../store/app-state.store';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../../models/auth/login-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly http = inject(HttpClient);

  private readonly appStateStore = inject(AppStateStore);

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/login`, credentials).pipe(
      tap(() => {
        this.appStateStore.setAppState({
          email: credentials.email,
          isLogged: true,
        });
      }),
    );
  }

  refresh(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/refresh`, {});
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(tap(() => this.appStateStore.logout()));
  }
}
