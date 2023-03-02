import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class HttpEaInterceptor implements HttpInterceptor {
  constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let bearinxLanguage: string;

    switch (this.translocoService.getActiveLang()) {
      case 'de':
        bearinxLanguage = 'LANGUAGE_GERMAN';
        break;
      case 'en':
        bearinxLanguage = 'LANGUAGE_ENGLISH';
        break;
      default:
        bearinxLanguage = 'LANGUAGE_ENGLISH';
    }

    const modifiedReq = req.clone({
      headers: req.headers
        .set('x-bearinx-tenantid', environment.tenantId)
        .set('x-bearinx-groupId', environment.groupId)
        .set('x-bearinx-language', bearinxLanguage),
    });

    return next.handle(modifiedReq);
  }
}
