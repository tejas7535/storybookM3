import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  CalculationParameters,
  ExtendedSearchParameters,
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

  public getBearingExtendedSearch(
    extendedSearchParameters: ExtendedSearchParameters
  ) {
    const params = this.getBearingExtendedSearchParams(
      extendedSearchParameters
    );

    return this.httpClient.get<string[]>(
      `${environment.baseUrl}/bearings/extendedsearch?${params}`
    );
  }

  public getBearingExtendedSearchCount(
    extendedSearchParameters: ExtendedSearchParameters
  ) {
    const params = this.getBearingExtendedSearchParams(
      extendedSearchParameters
    );

    return this.httpClient.get<number>(
      `${environment.baseUrl}/bearings/extendedsearch/count?${params}`
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

  private getBearingExtendedSearchParams(
    extendedSearchParameters: ExtendedSearchParameters
  ): URLSearchParams {
    const params = new URLSearchParams();

    if (extendedSearchParameters?.bearingType) {
      params.set('bearingType', extendedSearchParameters.bearingType);
    }

    if (extendedSearchParameters?.boreDiameterMin) {
      params.set('minDi', extendedSearchParameters.boreDiameterMin.toString());
    }

    if (extendedSearchParameters?.boreDiameterMax) {
      params.set('maxDi', extendedSearchParameters.boreDiameterMax.toString());
    }

    if (extendedSearchParameters?.outsideDiameterMin) {
      params.set(
        'minDa',
        extendedSearchParameters.outsideDiameterMin.toString()
      );
    }

    if (extendedSearchParameters?.outsideDiameterMax) {
      params.set(
        'maxDa',
        extendedSearchParameters.outsideDiameterMax.toString()
      );
    }

    if (extendedSearchParameters?.widthMin) {
      params.set('minB', extendedSearchParameters.widthMin.toString());
    }

    if (extendedSearchParameters?.widthMax) {
      params.set('maxB', extendedSearchParameters.widthMax.toString());
    }

    return params;
  }
}
