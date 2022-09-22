import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {} from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { ApiVersion } from '../models';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
  private readonly HEADER_LANGUAGE_KEY = 'language';
  public constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const activeLang = this.translocoService.getActiveLang();
    if (activeLang && request.url?.startsWith(ApiVersion.V1)) {
      const newRequest = request.clone({
        headers: request.headers.set(this.HEADER_LANGUAGE_KEY, activeLang),
      });

      return next.handle(newRequest);
    }

    return next.handle(request);
  }
}
