import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

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
        .set('x-bearinx-tenantid', 'c6bd4298-997b-4600-a90a-1adb997581b7')
        .set('x-bearinx-groupId', '111ab140-8e82-4ac4-a424-81edf0167301')
        .set('x-bearinx-language', bearinxLanguage)
        .set('x-bearinx-unitset', 'ID_UNIT_SET_SI'),
    });

    return next.handle(modifiedReq);
  }
}
