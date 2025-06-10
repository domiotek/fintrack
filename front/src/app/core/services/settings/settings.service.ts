import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  private readonly http = inject(HttpClient);

  updateUserPersonalInfo(firstName: string, lastName: string, currencyId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/config`, {
      firstName,
      lastName,
      currencyId,
    });
  }

  updateUserPassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/password`, {
      oldPassword: currentPassword,
      newPassword,
    });
  }
}
