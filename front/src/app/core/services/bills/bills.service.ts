import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { NewBillRequest } from '../../models/bills/new-bill-request';
import { BaseApiService } from '../base-api.service';
import { Observable, of } from 'rxjs';
import { Bill } from '../../bills/bill';

@Injectable({
  providedIn: 'root',
})
export class BillsService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly http = inject(HttpClient);

  getBills(): Observable<Bill[]> {
    return of([
      {
        id: 1,
        name: 'Groceries at Supermarket',
        date: '2025-05-25',
        amount: 125.5,
        category: {
          id: 1,
          name: 'Food',
          color: '#4CAF50',
          limit: 500,
          spendLimit: 400,
        },
        userValue: 125.5,
        billValue: 125.5,
        currencyId: 2,
      },
      {
        id: 2,
        name: 'Gas Station Fill-up',
        date: '2025-05-24',
        amount: 65.0,
        category: {
          id: 2,
          name: 'Transportation',
          color: '#2196F3',
          limit: 300,
          spendLimit: 250,
        },
        userValue: 65.0,
        billValue: 65.0,
        currencyId: 1,
      },
      {
        id: 3,
        name: 'Coffee Shop',
        date: '2025-05-23',
        amount: 12.75,
        category: {
          id: 3,
          name: 'Entertainment',
          color: '#FF9800',
          limit: 200,
          spendLimit: 150,
        },
        userValue: 12.75,
        billValue: 12.75,
        currencyId: 1,
      },
      {
        id: 4,
        name: 'Electric Bill',
        date: '2025-05-22',
        amount: 89.3,
        category: {
          id: 4,
          name: 'Utilities',
          color: '#9C27B0',
          limit: 400,
          spendLimit: 350,
        },
        userValue: 89.3,
        billValue: 89.3,
        currencyId: 1,
      },
      {
        id: 5,
        name: 'Restaurant Dinner',
        date: '2025-05-21',
        amount: 78.9,
        category: {
          id: 1,
          name: 'Food',
          color: '#4CAF50',
          limit: 500,
          spendLimit: 400,
        },
        userValue: 78.9,
        billValue: 78.9,
        currencyId: 1,
      },
    ]);
  }

  addBill(billData: NewBillRequest) {
    return this.http.post<void>(`${this.apiUrl}/bills`, {
      ...billData,
    });
  }
}
