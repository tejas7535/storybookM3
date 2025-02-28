import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class TranslocoCacheInterceptor implements HttpInterceptor {
  private readonly assetPath = '/assets/i18n/';
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(this.assetPath)) {
      const timestamp = Date.now();
      const modifiedUrl = `${req.url}?v=${timestamp}`;
      const modifiedReq = req.clone({ url: modifiedUrl });

      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
