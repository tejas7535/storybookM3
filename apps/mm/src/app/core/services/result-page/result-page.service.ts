import { Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { CalculationRequestPayload } from '@mm/shared/models/calculation-request/calculation-request.model';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { PROPERTIES } from '../../../shared/constants/tracking-names';
import { Report, Result } from '../../../shared/models';
import { RestService } from '../rest/rest.service';

@Injectable({ providedIn: 'root' })
export class ResultPageService {
  public constructor(
    private readonly restService: RestService,
    private readonly translocoService: TranslocoService,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  public getResult(
    requestPayload: CalculationRequestPayload
  ): Observable<Result> {
    this.trackProperties(requestPayload);

    return this.restService.getBearingCalculationResult(requestPayload).pipe(
      map((response) => response._links), // eslint-disable-line no-underscore-dangle
      map((reports: Report[]) => {
        const htmlReportUrl = reports
          .filter((report: Report) => report.rel === 'body')
          .pop().href;

        const pdfReportUrl = reports
          .filter((report: Report) => report.rel === 'pdf')
          .pop().href;

        // fallback for old API, new API should always return a json report, will need to be fixed before release of new report design
        const jsonReport = reports
          .filter((report: Report) => report.rel === 'json')
          .pop();

        const jsonReportUrl = jsonReport?.href ?? undefined;

        return { htmlReportUrl, pdfReportUrl, jsonReportUrl };
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

  public getJsonReport(jsonReportUrl: string): Observable<any> {
    return this.restService.getJsonReportResponse(jsonReportUrl);
  }

  public getHtmlBodyResponse(htmlBodyUrl: string): Observable<any> {
    return this.restService.getHtmlBodyReportResponse(htmlBodyUrl);
  }
}
