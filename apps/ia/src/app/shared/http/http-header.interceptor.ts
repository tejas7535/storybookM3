import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
  HEADER_CONTENT_TYPE = 'Content-Type';
  HEADER_CONTENT_TYPE_JSON = 'application/json';

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

    return next.handle(requestWithContentTypeHeader);
  }
}
