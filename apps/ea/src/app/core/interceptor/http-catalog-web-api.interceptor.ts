import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@ea/environments/environment';
import {
  LANGUAGE_DE,
  LANGUAGE_EN,
  LANGUAGE_ES,
  LANGUAGE_FR,
  LANGUAGE_IT,
  LANGUAGE_ZH,
  LANGUAGE_ZH_TW,
} from '@ea/shared/constants/language';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class HttpCatalogWebApiInterceptor implements HttpInterceptor {
  constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(environment.catalogApiBaseUrl)) {
      return next.handle(req);
    }

    let languageCode: string;

    switch (this.translocoService.getActiveLang()) {
      case LANGUAGE_EN.id:
        languageCode = 'en_US';
        break;
      case LANGUAGE_DE.id:
        languageCode = 'de_DE';
        break;
      case LANGUAGE_ES.id:
        languageCode = 'es_ES';
        break;
      case LANGUAGE_FR.id:
        languageCode = 'fr_FR';
        break;
      case LANGUAGE_IT.id:
        languageCode = 'en_US'; // Italian is not supported by an API. english as a fallback
        break;
      case LANGUAGE_ZH.id:
        languageCode = 'cn_CN';
        break;
      case LANGUAGE_ZH_TW.id:
        languageCode = 'en_US'; // Traditional chineese is not supported by an API. english as a fallback.
        break;
      default:
        languageCode = 'en_US';
    }

    const modifiedReq = req.clone({
      headers: req.headers.set('Locale', languageCode),
    });

    return next.handle(modifiedReq);
  }
}
