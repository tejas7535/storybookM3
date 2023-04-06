import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, throwError } from 'rxjs';

import { environment } from '@ea/environments/environment';

import { BasicFrequenciesResult } from '../store/models';
import { CatalogServiceBasicFrequenciesResult } from './catalog.service.interface';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly baseUrl = `${environment.baseUrl}/CatalogWebApi/v1/CatalogBearing`;

  constructor(private readonly httpClient: HttpClient) {}

  public getBearingIdFromDesignation(
    bearingDesignation: string
  ): Observable<string | undefined> {
    if (!bearingDesignation) {
      return throwError(() => new Error('bearingDesignation must be provided'));
    }

    return this.httpClient
      .get<{ id: string; designation: string }>(`${this.baseUrl}/product/id`, {
        params: { designation: bearingDesignation },
      })
      .pipe(map((res) => res?.id));
  }

  public getBasicFrequencies(
    bearingId: string
  ): Observable<BasicFrequenciesResult> {
    if (!bearingId) {
      return throwError(() => new Error('bearingId must be provided'));
    }

    return this.httpClient
      .get<CatalogServiceBasicFrequenciesResult>(
        `${this.baseUrl}/product/basicfrequencies/${bearingId}`
      )
      .pipe(
        map((results) => {
          const result = results.data.results[0];
          const basicFrequencies: BasicFrequenciesResult = {
            title: result.title,
            rows: result.fields,
          };

          return basicFrequencies;
        })
      );
  }

  public getBasicFrequenciesPdf(bearingId: string): Observable<Blob> {
    return this.httpClient.get(
      `${this.baseUrl}/product/basicfrequencies/pdf/${bearingId}`,
      {
        responseType: 'blob',
      }
    );
  }

  public downloadBasicFrequenciesPdf(bearingId: string): Observable<void> {
    return this.getBasicFrequenciesPdf(bearingId).pipe(
      map((data) => {
        // create download element and click on it
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(
          new Blob([data], { type: data.type })
        );

        downloadLink.click();
      })
    );
  }
}
