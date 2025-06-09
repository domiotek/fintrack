import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../../models/statistics/dashboard-stats';
import { DashboardStatsRequest } from '../../models/statistics/dashboard-stats-request';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}/statistics`;
  private readonly http = inject(HttpClient);

  getDashboardStats(req: DashboardStatsRequest): Observable<DashboardStats> {
    let params = new HttpParams({ fromObject: { from: req.from, to: req.to } });

    if (req.categoryId) params = params.set('categoryId', req.categoryId);

    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`, { params });
  }
}
