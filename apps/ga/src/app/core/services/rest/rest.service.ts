import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import {
  CalculationParameters,
  AdvancedBearingSelectionFilters,
  ExtendedSearchQueryParams,
  Property,
  Result,
} from '@ga/shared/models';

import { environment } from '../../../../environments/environment';

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
    selectionFilters: AdvancedBearingSelectionFilters
  ) {
    const params = this.getBearingExtendedSearchParams(selectionFilters);

    return this.httpClient.get<string[]>(
      `${environment.baseUrl}/bearings/extendedsearch?${params}`
    );
  }

  public getBearingExtendedSearchCount(
    selectionFilters: AdvancedBearingSelectionFilters
  ) {
    const params = this.getBearingExtendedSearchParams(selectionFilters);

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
    selectionFilters: AdvancedBearingSelectionFilters
  ): HttpParams {
    const adaptedSearchParams =
      this.adaptExtendedSearchParamsFromAdvancedSelectionFilters(
        selectionFilters
      );

    return new HttpParams({ fromObject: adaptedSearchParams });
  }

  adaptExtendedSearchParamsFromAdvancedSelectionFilters(
    selectionFilters: AdvancedBearingSelectionFilters
  ): ExtendedSearchQueryParams {
    const adaptedExtendedSearchParams: ExtendedSearchQueryParams = {
      bearingType: selectionFilters.bearingType,
      minDi: selectionFilters.boreDiameterMin,
      maxDi: selectionFilters.boreDiameterMax,
      minDa: selectionFilters.outsideDiameterMin,
      maxDa: selectionFilters.outsideDiameterMax,
      minB: selectionFilters.widthMin,
      maxB: selectionFilters.widthMax,
    };

    Object.keys(adaptedExtendedSearchParams).forEach((key) => {
      if (
        !adaptedExtendedSearchParams[key as keyof ExtendedSearchQueryParams]
      ) {
        delete adaptedExtendedSearchParams[
          key as keyof ExtendedSearchQueryParams
        ];
      }
    });

    return adaptedExtendedSearchParams;
  }
}
