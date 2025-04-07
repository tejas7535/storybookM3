import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { CalculationRequestPayload } from '@mm/shared/models/calculation-request.model';
import { withCache } from '@ngneat/cashew';

import { environment } from '../../../../environments/environment';
import {
  MMBearingPreflightResponse,
  PreflightRequestBody,
  SearchResult,
  ShaftMaterialResponse,
} from '../../../shared/models';
import { BearinxOnlineResult } from '../bearinx-result.interface';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private currentLanguage: string;

  private readonly bearingCalculationPath = `${environment.baseUrl}/calculate`;

  public constructor(private readonly httpClient: HttpClient) {}

  public setCurrentLanguage(language: string): void {
    this.currentLanguage = language;
  }

  public getBearingSearch(searchQuery: string): Observable<SearchResult> {
    return this.httpClient.get<SearchResult>(
      `${environment.baseUrl}/bearings/search?pattern=${searchQuery}&page=1&size=1000`
    );
  }

  public getBearingCalculationResult(
    requestPayload: CalculationRequestPayload
  ): Observable<BearinxOnlineResult> {
    return this.httpClient.post<BearinxOnlineResult>(
      this.bearingCalculationPath,
      requestPayload,
      {
        context: withCache({ version: JSON.stringify(requestPayload) }),
      }
    );
  }

  public getBearingPreflightResponse(
    body: PreflightRequestBody
  ): Observable<MMBearingPreflightResponse> {
    const path = `${environment.baseUrl}/dialog`;

    return this.httpClient.post<MMBearingPreflightResponse>(path, body);
  }

  public getBearingsMaterialResponse(
    idmmShaftMaterial: string
  ): Observable<ShaftMaterialResponse> {
    return this.httpClient.get<ShaftMaterialResponse>(
      `${environment.baseUrl}/materials/${idmmShaftMaterial}`,
      { context: withCache({ version: this.currentLanguage }) }
    );
  }

  public getLoadOptions<T>(requestUrl: string): Observable<T> {
    return this.httpClient.get<T>(requestUrl, {
      context: withCache({ version: this.currentLanguage }),
    });
  }

  public getBearinxVersions(): Observable<{ [key: string]: string }> {
    return this.httpClient
      .get<
        { name: string; version: string }[]
      >(`${environment.bearinxApiBaseUrl}/version`)
      .pipe(
        map((response) =>
          Object.fromEntries(
            response.map(({ name, version }) => [name, version])
          )
        )
      );
  }
}
