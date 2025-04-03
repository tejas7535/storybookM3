import {
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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

  private readonly translocoService: TranslocoService =
    inject(TranslocoService);

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers: { [name: string]: string | string[] } = {};

    request.headers.keys().forEach((key: string) => {
      headers[key] = request.headers.get(key);
    });

    if (request.context.get(AUTO_CONFIGURE_APPLICATION_JSON_HEADER)) {
      headers[this.HEADER_CONTENT_TYPE] = this.HEADER_CONTENT_TYPE_JSON;
    }

    if (
      request.url?.startsWith(`/${environment.apiUrl}`) ||
      request.url?.startsWith(environment.apiUrl)
    ) {
      headers[this.HEADER_LANGUAGE_KEY] = this.translocoService.getActiveLang();
      headers[this.HEADER_ACCEPT_LANGUAGE] =
        this.translocoService.getActiveLang();
    }

    const clonedRequest = request.clone({ setHeaders: headers });

    return next.handle(clonedRequest);
  }
}
