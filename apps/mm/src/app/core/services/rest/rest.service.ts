import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { DataService } from '@schaeffler/http';

import { environment } from '../../../../environments/environment';
import {
  MMBearingPreflightResponse,
  MMBearingsMaterialResponse,
  MMResponseVariants,
  PreflightRequestBody,
  Report,
  SearchResult,
} from '../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public constructor(private readonly dataService: DataService) {}

  public getBearingSearch(searchQuery: string): Observable<SearchResult> {
    return this.dataService.getAll<SearchResult>(
      `bearing/search/?pattern=${searchQuery}&page=1&size=1000`
    );
  }

  public getBearingRelations(id: string): Observable<any> {
    return this.dataService.getAll<any>(
      `${environment.bearingRelationsPath}${id}`
    );
  }

  // TODO: define interface
  public getBearingCalculationResult(
    formProperties: any
  ): Observable<{ data: any; state: boolean; _links: Report[] }> {
    return this.dataService.post<{
      data: any;
      state: boolean;
      _links: Report[];
    }>(`${environment.bearingCalculationPath}`, formProperties);
  }

  public getBearingPreflightResponse(
    body: PreflightRequestBody
  ): Observable<MMBearingPreflightResponse> {
    return this.dataService.post<MMBearingPreflightResponse>(
      `${environment.preflightPath}`,
      body
    );
  }

  // TODO: define interface
  public getBearingsMaterialResponse(
    idmmShaftMaterial: any
  ): Observable<MMBearingsMaterialResponse> {
    return this.dataService.getAll<MMBearingsMaterialResponse>(
      `${environment.materialsPath}${idmmShaftMaterial}`,
      withCache()
    );
  }

  public getLoadOptions(requestUrl: string): Observable<MMResponseVariants> {
    const replaceValue = `${environment.baseUrl}/`;
    const path = requestUrl.replace(replaceValue, '');

    return this.dataService.getAll<MMResponseVariants>(path, withCache());
  }
}
