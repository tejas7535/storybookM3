import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { TranslocoService } from '@jsverse/transloco';

@Injectable()
export class HttpBearinxInterceptor implements HttpInterceptor {
  constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(environment.frictionApiBaseUrl)) {
      return next.handle(req);
    }

    let bearinxLanguage: string;

    switch (this.translocoService.getActiveLang()) {
      // disabled German language as currently there is no option to change it
      /* case 'de':
        bearinxLanguage = 'LANGUAGE_GERMAN';
        break; */
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
        .set('x-bearinx-language', bearinxLanguage)
        .set('x-bearinx-unitset', 'ID_UNIT_SET_SI'),
    });

    return next.handle(modifiedReq);
  }
}
