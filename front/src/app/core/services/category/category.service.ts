import { Injectable, signal, WritableSignal } from '@angular/core';
import { Category } from '../../models/category/category';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categories = signal<Category[]>([]);

  getCategories(): WritableSignal<Category[]> {
    return this.categories;
  }

  getCategoriesList(): Observable<Category[]> {
    return of([
      {
        id: 1,
        name: 'Ogólne',
        color: '#65558F',
        limit: 150,
        spendLimit: 135,
      },
      {
        id: 2,
        name: 'Jedzenie',
        color: '#F9A826',
        spendLimit: 250,
      },
      {
        id: 3,
        name: 'Transport',
        color: '#E74C3C',
        limit: 200,
        spendLimit: 180,
      },
      {
        id: 4,
        name: 'Rozrywka',
        color: '#2ECC71',
        limit: 100,
        spendLimit: 90,
      },
    ]).pipe(
      tap((res) => {
        this.categories.set(res);
      }),
    );
  }
}
