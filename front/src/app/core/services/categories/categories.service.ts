import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { Observable } from 'rxjs';
import { Category } from '../../models/category/category.model';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;
  private readonly http = inject(HttpClient);

  getCategoriesList(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }
}
