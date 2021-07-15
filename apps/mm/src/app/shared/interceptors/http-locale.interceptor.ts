import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { locales, MMLocales } from '../../core/services/locale/locale.enum';

@Injectable()
export class HttpLocaleInterceptor implements HttpInterceptor {
  constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({
      headers: req.headers.set('Locale', this.getCurrentLongLocale()),
    });

    return req.url.includes('bearing-calculation/body')
      ? next.handle(req)
      : next.handle(modifiedReq);
  }

  public getCurrentLongLocale(): string {
    const lang = this.translocoService.getActiveLang();

    return locales[lang as MMLocales].longLocale;
  }
}
