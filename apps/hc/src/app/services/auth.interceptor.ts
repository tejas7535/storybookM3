import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, switchMap } from 'rxjs';

import { environment } from '@hc/environments/environment';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly targetHostUrl = new URL(environment.baseUrl);

  constructor(private readonly authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    try {
      // required because relative URLs cannot be parsed
      const targetUrl = new URL(req.url);
      if (targetUrl.host !== this.targetHostUrl.host) {
        // The request is not going out to our API
        return next.handle(req);
      }
    } catch {
      return next.handle(req);
    }

    return this.authService.isLoggedin().pipe(
      switchMap((isLoggedin) =>
        isLoggedin
          ? this.authService.getAccessToken().pipe(
              switchMap((token) => {
                if (!token) {
                  // no token -> not logged in
                  return next.handle(req);
                }
                const headers = req.headers.set(
                  'Authorization',
                  `Bearer ${token}`
                );
                const clone = req.clone({ headers });

                return next.handle(clone);
              })
            )
          : next.handle(req)
      )
    );
  }
}
