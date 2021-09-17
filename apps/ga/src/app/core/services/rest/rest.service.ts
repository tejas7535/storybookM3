import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CalculationParamters } from '../../../shared/models';

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
    return this.httpClient.post<string>(
      `${environment.baseUrl}/calculate`,
      options
    );
  }
}
