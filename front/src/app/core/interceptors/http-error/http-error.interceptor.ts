import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { inject, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, delay, EMPTY, Observable, retry, switchMap, tap, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    retry(1),
    catchError((err: HttpErrorResponse) => {
      const errorBody = err.error;

      if (errorBody?.message === 'Access token expired') {
        return authService.refresh().pipe(
          switchMap(() => {
            return next(req.clone());
          }),
          catchError((err) => {
            return handleAuthError(err, authService, router);
          }),
        );
      }

      if (isDevMode()) {
        console.log('Error occurred:', errorBody?.message);
      }

      return throwError(() => err);
    }),
  );
};

function handleAuthError(err: any, authService: AuthService, router: Router): Observable<never> {
  return authService.logout().pipe(
    delay(3000),
    tap(() => router.navigate(['login'])),
    switchMap(() => EMPTY),
  );
}
