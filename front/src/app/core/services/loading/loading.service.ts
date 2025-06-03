import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly isLoading = signal<boolean>(false);

  private readonly counter = signal<number>(0);

  getLoadingState() {
    return this.isLoading.asReadonly();
  }

  setLoading(state: boolean): void {
    if (state) {
      this.counter.update((count) => count + 1);
    } else {
      this.counter.update((count) => Math.max(count - 1, 0));
    }

    this.isLoading.set(this.counter() > 0);
  }
}
