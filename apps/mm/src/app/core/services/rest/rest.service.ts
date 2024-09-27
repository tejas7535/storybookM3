import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, retry, take, timer } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { environment } from '../../../../environments/environment';
import {
  MMBearingPreflightResponse,
  MMBearingsMaterialResponse,
  MMResponseVariants,
  PreflightRequestBody,
  Report,
  SearchResult,
} from '../../../shared/models';
import { BearinxOnlineResult } from '../bearinx-result.interface';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private currentLanguage: string;

  public constructor(private readonly httpClient: HttpClient) {}

  public setCurrentLanguage(language: string): void {
    this.currentLanguage = language;
  }

  public getBearingSearch(searchQuery: string): Observable<SearchResult> {
    return this.httpClient.get<SearchResult>(
      `${environment.baseUrl}/bearing/search/?pattern=${searchQuery}&page=1&size=1000`
    );
  }

  public getBearingRelations(id: string): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.baseUrl}/${environment.bearingRelationsPath}${id}`
    );
  }

  // TODO: define interface
  public getBearingCalculationResult(
    formProperties: any
  ): Observable<{ data: any; state: boolean; _links: Report[] }> {
    return this.httpClient.post<{
      data: any;
      state: boolean;
      _links: Report[];
    }>(
      `${environment.baseUrl}/${environment.bearingCalculationPath}`,
      formProperties,
      {
        context: withCache({ version: JSON.stringify(formProperties) }),
      }
    );
  }

  public getBearingPreflightResponse(
    body: PreflightRequestBody
  ): Observable<MMBearingPreflightResponse> {
    return this.httpClient.post<MMBearingPreflightResponse>(
      `${environment.baseUrl}/${environment.preflightPath}`,
      body
    );
  }

  // TODO: define interface
  public getBearingsMaterialResponse(
    idmmShaftMaterial: any
  ): Observable<MMBearingsMaterialResponse> {
    return this.httpClient.get<MMBearingsMaterialResponse>(
      `${environment.baseUrl}/${environment.materialsPath}${idmmShaftMaterial}`,
      { context: withCache({ version: this.currentLanguage }) }
    );
  }

  public getLoadOptions(requestUrl: string): Observable<MMResponseVariants> {
    return this.httpClient.get<MMResponseVariants>(requestUrl, {
      context: withCache({ version: this.currentLanguage }),
    });
  }

  public getPdfReportRespone(pdfDownloadUrl: string): Observable<boolean> {
    return this.httpClient.get(pdfDownloadUrl, { responseType: 'blob' }).pipe(
      take(1),
      map(() => true),
      retry({
        delay: (_error, count) => timer(count <= 10 ? 3000 : 10_000),
      })
    );
  }

  public getJsonReportResponse(
    jsonReportUrl: string
  ): Observable<BearinxOnlineResult> {
    return this.httpClient.get<BearinxOnlineResult>(jsonReportUrl);
  }
}
