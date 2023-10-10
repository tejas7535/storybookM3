import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';

@Injectable()
export class HttpMSDInterceptor implements HttpInterceptor {
  includePattern = '/materials-supplier-database/api/';

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !req.url.includes(this.includePattern) ||
      req.method !== 'POST' ||
      req.body instanceof FormData // Content-Type should not be set manually for multipart/form-data requests!
    ) {
      return next.handle(req);
    }

    const type = req.headers.get('Content-Type') || 'application/json';

    const modifiedReq = req.clone({
      headers: req.headers
        .set('Target-Content-Type', type)
        .set('Content-Type', 'text/plain'),
      body: Buffer.from(JSON.stringify(req.body)).toString('base64'),
    });

    return next.handle(modifiedReq);
  }
}
