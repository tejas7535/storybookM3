import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { environment } from '../../../environments/environment';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  private readonly HEADER_LANGUAGE_KEY = 'language';
  private readonly HEADER_CONTENT_TYPE = 'Content-Type';
  private readonly HEADER_CONTENT_TYPE_JSON = 'application/json';
  private readonly HEADER_ACCEPT_LANGUAGE = 'Accept-Language';

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
      request.url?.startsWith(`/${environment.apiUrl}`) ||
      request.url?.startsWith(environment.apiUrl)
    ) {
      const newRequest = requestWithContentTypeHeader.clone({
        headers: requestWithContentTypeHeader.headers
          .set(this.HEADER_LANGUAGE_KEY, activeLang)
          .set(this.HEADER_ACCEPT_LANGUAGE, activeLang)
          .set(this.HEADER_CONTENT_TYPE, this.HEADER_CONTENT_TYPE_JSON),
      });

      return next.handle(newRequest);
    }

    return next.handle(requestWithContentTypeHeader);
  }
}
