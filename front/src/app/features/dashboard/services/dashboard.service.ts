import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/services/base-api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { NewBillRequest } from '../../../core/models/bills/new-bill-request';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly http = inject(HttpClient);

  addBill(billData: NewBillRequest) {
    return this.http.post<void>(`${this.apiUrl}/bills`, {
      ...billData,
    });
  }
}
