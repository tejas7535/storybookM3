import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class HttpGreaseInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({
      headers: req.headers
        .set('x-bearinx-tenantid', 'c6bd4298-997b-4600-a90a-1adb997581b7')
        .set('x-bearinx-groupId', '111ab140-8e82-4ac4-a424-81edf0167301')
        .set('x-bearinx-language', 'LANGUAGE_ENGLISH')
        .set('x-bearinx-unitset', 'ID_UNIT_SET_SI'),
    });

    return next.handle(modifiedReq);
  }
}
