import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly isLoading = signal<boolean>(false);

  getLoadingState() {
    return this.isLoading.asReadonly();
  }

  setLoading(state: boolean): void {
    this.isLoading.set(state);
  }
}
