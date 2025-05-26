import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { NewBillRequest } from '../../models/bills/new-bill-request';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root',
})
export class BillsService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly http = inject(HttpClient);

  addBill(billData: NewBillRequest) {
    return this.http.post<void>(`${this.apiUrl}/bills`, {
      ...billData,
    });
  }
}
