import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Report, Result } from './result.model';

@Injectable()
export class ResultPageService {
  constructor(private readonly http: HttpClient) {}

  getResult(formProperties: any): Observable<Result> {
    const requestUrl = `${environment.apiMMBaseUrl}/bearing-calculation`;

    return this.http
      .post<{ data: any; state: boolean; _links: Report[] }>(
        requestUrl,
        formProperties
      )
      .pipe(
        map((response) => response._links), // eslint-disable-line no-underscore-dangle
        map((reports: Report[]) => {
          const htmlReportUrl = reports
            .filter((report: Report) => report.rel === 'body')
            .pop().href;

          const pdfReportUrl = reports
            .filter((report: Report) => report.rel === 'pdf')
            .pop().href;

          return { htmlReportUrl, pdfReportUrl };
        })
      );
  }
}
