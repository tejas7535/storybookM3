import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { detectPartnerVersion } from '@ga/core/helpers/settings-helpers';
import { environment } from '@ga/environments/environment';
import {
  AdvancedBearingSelectionFilters,
  CalculationParameters,
  DialogResponse,
  ExtendedSearchQueryParams,
  Property,
  Result,
} from '@ga/shared/models';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private readonly baseUrl = detectPartnerVersion()
    ? environment.partnerUrl
    : environment.baseUrl;

  public constructor(private readonly httpClient: HttpClient) {}

  public getBearingSearch(query: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/bearings/search`, {
      params: {
        pattern: query,
      },
    });
  }

  public getBearingExtendedSearch(
    selectionFilters: AdvancedBearingSelectionFilters
  ) {
    const params = this.getBearingExtendedSearchParams(selectionFilters);

    return this.httpClient.get<string[]>(
      `${this.baseUrl}/bearings/extendedsearch?${params}`
    );
  }

  public getBearingExtendedSearchCount(
    selectionFilters: AdvancedBearingSelectionFilters
  ) {
    const params = this.getBearingExtendedSearchParams(selectionFilters);

    return this.httpClient.get<number>(
      `${this.baseUrl}/bearings/extendedsearch/count?${params}`
    );
  }

  public getProperties(modelId: string): Observable<Property[]> {
    return this.httpClient.get<Property[]>(
      `${this.baseUrl}/${modelId}/properties`
    );
  }

  public putModelCreate(bearing: string): Observable<string> {
    return this.httpClient.put<string>(
      `${this.baseUrl}/create?designation=${bearing}`,
      {}
    );
  }

  public putModelUpdate(
    modelId: string,
    options: CalculationParameters
  ): Observable<string> {
    return this.httpClient.put<string>(
      `${this.baseUrl}/${modelId}/update`,
      options
    );
  }

  public getGreaseCalculation(modelId: string): Observable<string> {
    return this.httpClient
      .get<Result>(`${this.baseUrl}/${modelId}/calculate`)
      .pipe(map((res: Result) => res._links[1].href.split('/').pop()));
  }

  public getDialog(modelId: string) {
    return this.httpClient.get<DialogResponse>(
      `${this.baseUrl}/${modelId}/dialog`,
      {
        context: withCache(),
      }
    );
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

  private adaptExtendedSearchParamsFromAdvancedSelectionFilters(
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
