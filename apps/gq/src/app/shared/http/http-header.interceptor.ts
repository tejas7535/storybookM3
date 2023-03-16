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
  private readonly HEADER_CONTENT_TYPE = 'Content-Type';
  private readonly HEADER_CONTENT_TYPE_JSON = 'application/json';

  public constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const requestWithContentTypeHeader = request.clone({
      headers: request.headers.set(
        this.HEADER_CONTENT_TYPE,
        this.HEADER_CONTENT_TYPE_JSON
      ),
    });

    const activeLang = this.translocoService.getActiveLang();
    if (
      activeLang &&
      requestWithContentTypeHeader.url?.startsWith(ApiVersion.V1)
    ) {
      const newRequest = requestWithContentTypeHeader.clone({
        headers: requestWithContentTypeHeader.headers
          .set(this.HEADER_LANGUAGE_KEY, activeLang)
          .set(this.HEADER_CONTENT_TYPE, 'application/json'),
      });

      return next.handle(newRequest);
    }

    return next.handle(requestWithContentTypeHeader);
  }
}
