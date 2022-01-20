import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  CalculationParameters,
  Property,
  Result,
} from '../../../shared/models';

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

  public getProperties(modelId: string): Observable<Property[]> {
    return this.httpClient.get<Property[]>(
      `${environment.baseUrl}/${modelId}/properties`
    );
  }

  public putModelCreate(bearing: string): Observable<string> {
    return this.httpClient.put<string>(
      `${environment.baseUrl}/create?designation=${bearing}`,
      {}
    );
  }

  public putModelUpdate(
    modelId: string,
    options: CalculationParameters
  ): Observable<string> {
    return this.httpClient.put<string>(
      `${environment.baseUrl}/${modelId}/update`,
      options
    );
  }

  public getGreaseCalculation(modelId: string): Observable<string> {
    return this.httpClient
      .get<Result>(`${environment.baseUrl}/${modelId}/calculate`)
      .pipe(map((res: Result) => res._links[1].href.split('/').pop()));
  }
}
