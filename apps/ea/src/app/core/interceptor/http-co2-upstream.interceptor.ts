import { DOCUMENT } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@ea/environments/environment';

@Injectable()
export class HttpCO2UpstreamInterceptor implements HttpInterceptor {
  private readonly window: Window;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.window = document.defaultView;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !req.url.startsWith(environment.co2UpstreamApiBaseUrl) ||
      req.method !== 'POST'
    ) {
      return next.handle(req);
    }

    const modifiedReq = req.clone({
      headers: req.headers
        .set('Target-Content-Type', 'application/json')
        .set('Content-Type', 'text/plain'),
      body: this.window.btoa(JSON.stringify(req.body)),
    });

    return next.handle(modifiedReq);
  }
}
