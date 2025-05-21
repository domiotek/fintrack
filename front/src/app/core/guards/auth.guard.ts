import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStateStore } from '../store/app-state.store';
import { map, take } from 'rxjs';

const PROTECTED_ROUTES = ['dashboard', 'stats', 'settings', 'events', 'friends', 'categories'];

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const appStateStore = inject(AppStateStore);
  const path = route.url?.length ? route.url[0].path : '';

  return appStateStore.appState$.pipe(
    take(1),
    map((state) => {
      if (state.isLogged) {
        if (PROTECTED_ROUTES.includes(path)) {
          return true;
        }
        return router.createUrlTree(['dashboard']);
      } else {
        if (PROTECTED_ROUTES.includes(path)) {
          return router.createUrlTree(['login']);
        }
        return true;
      }
    }),
  );
};
