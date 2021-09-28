import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CalculationParamters, Result } from '../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public constructor(private readonly httpClient: HttpClient) {}

  public getBearingSearch(query: string): Observable<string[]> {
    return this.httpClient.get<string[]>(
      `${environment.baseUrl}/bearings/search`,
      {
        params: {
          pattern: query,
        },
      }
    );
  }

  public postGreaseCalculation(
    options: CalculationParamters
  ): Observable<string> {
    return this.httpClient
      .post<Result>(`${environment.baseUrl}/calculate`, options)
      .pipe(map((res: Result) => res._links[1].href.split('/').pop()));
  }
}
