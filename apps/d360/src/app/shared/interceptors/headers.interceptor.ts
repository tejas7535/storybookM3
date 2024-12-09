import {
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { environment } from '../../../environments/environment';

export const AUTO_CONFIGURE_APPLICATION_JSON_HEADER = new HttpContextToken(
  () => true
);

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
    const clonedRequest = request.clone();

    if (request.context.get(AUTO_CONFIGURE_APPLICATION_JSON_HEADER)) {
      clonedRequest.headers.set(
        this.HEADER_CONTENT_TYPE,
        this.HEADER_CONTENT_TYPE_JSON
      );
    }

    const activeLang = this.translocoService.getActiveLang();

    if (
      request.url?.startsWith(`/${environment.apiUrl}`) ||
      request.url?.startsWith(environment.apiUrl)
    ) {
      clonedRequest.headers
        .set(this.HEADER_LANGUAGE_KEY, activeLang)
        .set(this.HEADER_ACCEPT_LANGUAGE, activeLang);
    }

    return next.handle(clonedRequest);
  }
}
