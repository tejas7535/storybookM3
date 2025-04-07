import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { environment } from '@mm/environments/environment';

@Injectable()
export class HttpLocaleInterceptor implements HttpInterceptor {
  private readonly METRIC_UNIT = 'ID_UNIT_SET_SI';

  constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(environment.baseUrl)) {
      return next.handle(req);
    }

    const bearinxLanguage: string = this.getBearinxLanguage();

    const modifiedReq = req.clone({
      headers: req.headers
        .set('x-bearinx-unitset', this.METRIC_UNIT)
        .set('x-bearinx-language', bearinxLanguage),
    });

    return next.handle(modifiedReq);
  }

  private getBearinxLanguage(): string {
    const languageMap: Record<string, string> = {
      de: 'LANGUAGE_GERMAN',
      en: 'LANGUAGE_ENGLISH',
      fr: 'LANGUAGE_FRENCH',
      ru: 'LANGUAGE_RUSSIAN',
      es: 'LANGUAGE_SPANISH',
      zh: 'LANGUAGE_CHINESE',
    };

    return (
      languageMap[this.translocoService.getActiveLang()] || 'LANGUAGE_ENGLISH'
    );
  }
}
