import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ConfigResponse } from '../../models/auth/config-response.model';
import { AppStateStore } from '../../store/app-state.store';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../../models/currency/currency.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly http = inject(HttpClient);

  private readonly appStateStore = inject(AppStateStore);

  getCurrencyList(): Observable<Currency[]> {
    return of<Currency[]>([
      {
        id: 1,
        code: 'PLN',
        name: 'Polski Złoty',
      },
      {
        id: 2,
        code: 'USD',
        name: 'Dolar amerykański',
      },
      {
        id: 3,
        code: 'EUR',
        name: 'Euro',
      },
    ]).pipe(
      tap((res) => {
        this.appStateStore.setCurrenciesList(res);
      }),
    );
  }

  getConfig(): Observable<ConfigResponse> {
    return new Observable<ConfigResponse>((observer) => {
      const shouldFail = false;
      if (shouldFail) {
        observer.error(new Error('Simulated HTTP error'));
      } else {
        observer.next({
          email: 'test',
          firstName: 'test',
          currency: {
            id: 1,
            code: 'PLN',
            name: 'Polski Złoty',
          },
        });
        observer.complete();
      }
    }).pipe(
      tap((config) => {
        this.appStateStore.setAppState({
          email: config.email,
          firstName: config.firstName,
          currency: config.currency,
          isLogged: true,
        });
      }),
    );
  }
}
