import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { environment } from '@ga/../environments/environment';

@Injectable()
export class HttpGreaseInterceptor implements HttpInterceptor {
  constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentLanguage = this.translocoService.getActiveLang();

    let bearinxLanguage: string;
    switch (currentLanguage) {
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
        .set('x-bearinx-language', bearinxLanguage)
        .set('x-bearinx-unitset', 'ID_UNIT_SET_SI'),
    });

    return next.handle(modifiedReq);
  }
}
