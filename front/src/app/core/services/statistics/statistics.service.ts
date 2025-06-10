import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../../models/statistics/dashboard-stats';
import { BaseStatsRequest } from '../../models/statistics/base-stats-request';
import { GroupedStatsRequest } from '../../models/statistics/grouped-stats-request';
import { Stats } from '../../models/statistics/stats.model';
import { TimeRangeReq } from '../../models/time-range/time-range-req';
import { OperationStatsRequest } from '../../models/statistics/operation-stats.request';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}/statistics`;
  private readonly http = inject(HttpClient);

  getDashboardStats(req: BaseStatsRequest): Observable<DashboardStats> {
    let params = new HttpParams({ fromObject: { from: req.from, to: req.to } });

    if (req.categoryId) params = params.set('categoryId', req.categoryId);

    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`, { params });
  }

  getExpensesStats(req: GroupedStatsRequest): Observable<Stats> {
    let params = new HttpParams({ fromObject: { from: req.from, to: req.to, group: req.group } });

    if (req.categoryId) params = params.set('categoryId', req.categoryId);

    return this.http.get<Stats>(`${this.apiUrl}/expenses`, { params });
  }

  getCategoriesStats(req: TimeRangeReq): Observable<Stats> {
    let params = new HttpParams({ fromObject: { from: req.from, to: req.to } });

    return this.http.get<Stats>(`${this.apiUrl}/categories`, { params });
  }

  getTransactionsStats(req: GroupedStatsRequest): Observable<Stats> {
    let params = new HttpParams({ fromObject: { from: req.from, to: req.to, group: req.group } });

    return this.http.get<Stats>(`${this.apiUrl}/transactions`, { params });
  }

  getDayOfWeekStats(req: OperationStatsRequest): Observable<Stats> {
    let params = new HttpParams({ fromObject: { from: req.from, to: req.to, operation: req.operation } });

    if (req.categoryId) params = params.set('categoryId', req.categoryId);

    return this.http.get<Stats>(`${this.apiUrl}/day-of-week`, { params });
  }
}
