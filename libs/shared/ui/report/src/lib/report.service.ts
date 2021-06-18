import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Content {
  title: string;
  content: any[];
  defaultOpen?: boolean;
}

@Injectable()
export class ReportService {
  public constructor(private readonly http: HttpClient) {}

  public getReport(htmlReportUrl: string): Observable<any> {
    return this.http.get<{ data: string }>(htmlReportUrl).pipe(
      map((response: { data: string }) => response.data),
      map((report: string) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(report, 'text/html');
        const bodyContent = htmlDoc.querySelector('body')?.children;

        const structuredContent =
          bodyContent &&
          Array.from(bodyContent).reduce((acc: any, section: any) => {
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
      })
    );
  }
}
