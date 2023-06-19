import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FetchInterceptor implements HttpInterceptor {
  private readonly authService: AuthService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.tokenObservable.pipe(
      tap((token) => token),
      switchMap((token) => {
        const existingHeaders: { [header: string]: string } = {};
        req.headers.keys().forEach((key) => {
          existingHeaders[key] = req.headers.get(key) as string;
        });

        req = req.clone({
          setHeaders: {
            ...existingHeaders,
            Authorization: `Bearer ${token}`,
          },
        });

        return next.handle(req);
      })
    );
  }
}
