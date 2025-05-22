import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private navigationState: Record<string, unknown> = {};

  private readonly router = inject(Router);

  navigate(url: any[], state?: Record<string, unknown>): void {
    this.navigationState = state || {};
    this.router.navigate(url, { state: this.navigationState });
  }

  getAndConsumeNavigationState(): Record<string, unknown> {
    const tempState = this.navigationState;
    this.navigationState = {};

    return tempState;
  }
}
