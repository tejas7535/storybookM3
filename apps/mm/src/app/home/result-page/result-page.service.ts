import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { Observable, throwError, catchError, map } from 'rxjs';
import { Report, Result } from '../../shared/models';
import { RestService } from './../../core/services/rest/rest.service';

@Injectable()
export class ResultPageService {
  public constructor(
    private readonly restService: RestService,
    private readonly translocoService: TranslocoService
  ) {}

  public getResult(formProperties: any): Observable<Result> {
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
        throwError(
          () => new Error(this.translocoService.translate('error.content'))
        )
      )
    );
  }
}
