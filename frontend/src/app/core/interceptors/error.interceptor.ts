import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if ([401, 403].includes(err.status)) {
        authService.logout();
        router.navigate(['/login']);
      }
      
      const error = err.error?.message || err.error?.errors || err.statusText || 'An error occurred';
      return throwError(() => error);
    })
  );
};
