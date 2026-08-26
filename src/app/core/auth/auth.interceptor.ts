import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

/**
 * Attaches `Authorization: Bearer <token>` to every outgoing request.
 * No HTTP calls are made against a real backend yet, but this is wired up
 * so a future Spring Boot API only needs `environment.apiUrl` to work.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
