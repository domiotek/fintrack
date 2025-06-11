import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Category } from '../../models/category/category.model';
import { Observable, tap } from 'rxjs';
import { CategoriesApiRequest } from '../../models/category/get-many.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BasePagingResponse } from '../../models/api/paging.model';
import { DateTime } from 'luxon';
import { CategoryRequest } from '../../models/category/category-request';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;
  private readonly categories = signal<Category[]>([]);

  readonly httpClient = inject(HttpClient);

  getCategories(): WritableSignal<Category[]> {
    return this.categories;
  }

  getCategoriesList(request?: CategoriesApiRequest): Observable<BasePagingResponse<Category>> {
    const timeRange = {
      from: DateTime.now().startOf('month'),
      to: DateTime.now().endOf('month'),
    };

    const params = new HttpParams({
      fromObject: { sortDirection: 'DESC', from: timeRange.from.toISO(), to: timeRange.to.toISO(), ...request },
    });

    return this.httpClient.get<BasePagingResponse<Category>>(`${this.apiUrl}`, { params }).pipe(
      tap((res) => {
        this.categories.set(res.content || []);
      }),
    );
  }

  createCategory(req: CategoryRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}`, req);
  }

  updateCategory(id: number, req: CategoryRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/${id}`, req);
  }

  deleteCategory(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
