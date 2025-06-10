import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NewBillRequest } from '../../models/bills/new-bill-request';
import { BaseApiService } from '../base-api.service';
import { Observable, tap } from 'rxjs';
import { Bill } from '../../models/bills/bill.model';
import { BasePagingResponse } from '../../models/api/paging.model';
import { BillsApiRequest } from '../../models/bills/get-many.model';

@Injectable({
  providedIn: 'root',
})
export class BillsService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}/bills`;
  private readonly http = inject(HttpClient);

  bills = signal<Bill[]>([]);

  getBills(request?: BillsApiRequest): Observable<BasePagingResponse<Bill>> {
    const params = new HttpParams({ fromObject: { sortDirection: 'DESC', ...request } });

    return this.http.get<BasePagingResponse<Bill>>(`${this.apiUrl}`, { params }).pipe(
      tap((res) => {
        if (res?.content && Array.isArray(res.content)) this.bills.set(res.content);
      }),
    );
  }

  addBill(billData: NewBillRequest) {
    return this.http.post<void>(`${this.apiUrl}`, billData);
  }
}
