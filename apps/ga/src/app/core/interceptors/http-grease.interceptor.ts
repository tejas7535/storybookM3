import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { environment } from '@ga/environments/environment';
import { MeasurementUnitsService } from '@ga/shared/services';

import { detectPartnerVersion } from '../helpers/settings-helpers';

@Injectable()
export class HttpGreaseInterceptor implements HttpInterceptor {
  private readonly baseUrl = detectPartnerVersion()
    ? environment.partnerUrl
    : environment.baseUrl;

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly measurementUnitsService: MeasurementUnitsService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(this.baseUrl)) {
      return next.handle(req);
    }

    let bearinxLanguage: string;

    switch (this.translocoService.getActiveLang()) {
      case 'de':
        bearinxLanguage = 'LANGUAGE_GERMAN';
        break;
      case 'en':
        bearinxLanguage = 'LANGUAGE_ENGLISH';
        break;
      case 'zh':
        bearinxLanguage = 'LANGUAGE_CHINESE';
        break;
      default:
        bearinxLanguage = 'LANGUAGE_ENGLISH';
    }

    const modifiedReq = req.clone({
      headers: req.headers
        .set('x-bearinx-tenantid', environment.tenantId)
        .set('x-bearinx-groupId', environment.groupId)
        .set('x-bearinx-language', bearinxLanguage)
        .set(
          'x-bearinx-unitset',
          this.measurementUnitsService.getMeasurementUnits()
        ),
    });

    return next.handle(modifiedReq);
  }
}
