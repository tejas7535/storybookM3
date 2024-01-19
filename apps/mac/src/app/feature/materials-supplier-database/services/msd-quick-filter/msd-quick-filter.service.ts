import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@mac/environments/environment';
import { MaterialClass, NavigationLevel } from '@mac/msd/constants';

import { NewQuickFilterRequest, QuickFilter } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class MsdQuickFilterService {
  private readonly MSD_URL = '/materials-supplier-database/api';
  private readonly BASE_URL = `${environment.baseUrl}${this.MSD_URL}/v1/quickfilter`;

  constructor(private readonly httpClient: HttpClient) {}

  createNewQuickFilter(
    newQuickFilterRequest: NewQuickFilterRequest
  ): Observable<QuickFilter> {
    return this.httpClient.post<QuickFilter>(
      this.BASE_URL,
      newQuickFilterRequest
    );
  }

  updateQuickFilter(quickFilter: QuickFilter): Observable<QuickFilter> {
    return this.httpClient.put<QuickFilter>(this.BASE_URL, quickFilter);
  }

  getPublishedQuickFilters(
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel
  ): Observable<QuickFilter[]> {
    return this.httpClient.get<QuickFilter[]>(
      `${this.BASE_URL}/${materialClass}/${navigationLevel}/maintained`
    );
  }

  getSubscribedQuickFilters(
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel
  ): Observable<QuickFilter[]> {
    return this.httpClient.get<QuickFilter[]>(
      `${this.BASE_URL}/${materialClass}/${navigationLevel}/subscribed`
    );
  }

  deleteQuickFilter(quickFilterId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.BASE_URL}/${quickFilterId}`);
  }

  subscribeQuickFilter(quickFilterId: number): Observable<void> {
    return this.httpClient.post<void>(
      `${this.BASE_URL}/${quickFilterId}/subscription`,
      {}
    );
  }

  unsubscribeQuickFilter(quickFilterId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.BASE_URL}/${quickFilterId}/subscription`
    );
  }

  enableQuickFilterNotification(quickFilterId: number): Observable<void> {
    return this.httpClient.post<void>(
      `${this.BASE_URL}/${quickFilterId}/notification`,
      {}
    );
  }

  disableQuickFilterNotification(quickFilterId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.BASE_URL}/${quickFilterId}/notification`
    );
  }

  queryQuickFilters(
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel,
    searchExpression: string,
    resultMaxSize: number = 99
  ): Observable<QuickFilter[]> {
    const params = new HttpParams()
      .set('resultMaxSize', resultMaxSize)
      .set('searchExpression', searchExpression);

    return this.httpClient.get<QuickFilter[]>(
      `${this.BASE_URL}/${materialClass}/${navigationLevel}`,
      { params }
    );
  }
}
