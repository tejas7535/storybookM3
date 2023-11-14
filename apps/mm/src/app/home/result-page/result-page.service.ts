import { Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { PROPERTIES } from '../../shared/constants/tracking-names';
import { Report, Result } from '../../shared/models';
import { RestService } from './../../core/services/rest/rest.service';

@Injectable()
export class ResultPageService {
  public constructor(
    private readonly restService: RestService,
    private readonly translocoService: TranslocoService,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  public getResult(formProperties: any): Observable<Result> {
    this.trackProperties(formProperties);

    return this.restService.getBearingCalculationResult(formProperties).pipe(
      map((response) => response._links), // eslint-disable-line no-underscore-dangle
      map((reports: Report[]) => {
        const htmlReportUrl = reports
          .filter((report: Report) => report.rel === 'body')
          .pop().href;

        const pdfReportUrl = reports
          .filter((report: Report) => report.rel === 'pdf')
          .pop().href;

        return { htmlReportUrl, pdfReportUrl };
      }),
      catchError(() =>
        throwError(() => this.translocoService.translate('error.content'))
      )
    );
  }

  public getPdfReportReady(pdfDownloadUrl: string): Observable<boolean> {
    return this.restService.getPdfReportRespone(pdfDownloadUrl);
  }

  public trackProperties(properties: any): void {
    this.applicationInsightsService.logEvent(PROPERTIES, properties);
  }
}
