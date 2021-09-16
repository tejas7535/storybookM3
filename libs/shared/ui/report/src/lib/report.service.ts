import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { jsonReport } from '../mocks/json-report';
import { Content, Subordinate } from './models';

@Injectable()
export class ReportService {
  public constructor(private readonly http: HttpClient) {}

  public getHtmlReport(htmlReportUrl: string): Observable<any> {
    return this.http.get<{ data: string }>(htmlReportUrl).pipe(
      map((response: { data: string }) => response.data),
      map((report: string) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(report, 'text/html');
        // with the new api caeonlinecalculation-q --> querySelector('.content')
        // with the new api mountingmanager-cae --> querySelector('body')
        const bodyContent = htmlDoc.querySelector('body')?.children;

        const structuredContent =
          bodyContent &&
          // eslint-disable-next-line unicorn/no-array-reduce
          [...(bodyContent as any)].reduce((acc: any, section: any) => {
            const content = section.querySelectorAll('[name^="anchor_"]');

            return section.localName === 'h1' &&
              content.length > 0 &&
              content[0].text
              ? [
                  ...acc,
                  {
                    title: content[0].text,
                    content: [],
                    defaultOpen: content[0].name === 'anchor_7',
                  },
                ]
              : [
                  ...acc.map((entry: Content, index: number) =>
                    acc.length === index + 1
                      ? {
                          ...entry,
                          content: [...entry.content, section],
                        }
                      : entry
                  ),
                ];
          }, []);

        return structuredContent;
      }),
      catchError(() => throwError(() => new Error('Unexpected error')))
    );
  }

  public getJsonReport(_jsonReportUrl: string): Observable<Subordinate[]> {
    const structuredContent = jsonReport.subordinates;

    return of(structuredContent);
  }
}
