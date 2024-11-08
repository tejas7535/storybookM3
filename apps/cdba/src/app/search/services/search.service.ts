import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { firstValueFrom, from, Observable, of } from 'rxjs';
import { map, timeout } from 'rxjs/operators';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { withCache } from '@ngneat/cashew';

import { API, BomExportPath } from '@cdba/shared/constants/api';
import { BOM_EXPORT_TIMEOUT } from '@cdba/shared/constants/table';
import { HttpParamsEncoder } from '@cdba/shared/http';
import { ReferenceTypeIdentifier } from '@cdba/shared/models/reference-type-identifier.model';

import {
  FilterItem,
  FilterItemIdValue,
  FilterItemIdValueUpdate,
  FilterItemRange,
  FilterItemRangeUpdate,
  FilterItemType,
  SearchResult,
} from '../../core/store/reducers/search/models';
import { InitialFiltersResponse } from '../initial-filters-response.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly PARAM_LANGUAGE = 'language';
  private readonly PARAM_SEARCH_FOR = 'search_for';

  private readonly INITIAL_FILTER = 'initial-filter';
  private readonly SEARCH = 'search';
  private readonly POSSIBLE_FILTER = 'possible-filter';

  public constructor(
    private readonly httpClient: HttpClient,
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage
  ) {}

  public getInitialFilters(): Observable<FilterItem[]> {
    return this.httpClient
      .get<InitialFiltersResponse>(`${API.v1}/${this.INITIAL_FILTER}`, {
        context: withCache(),
      })
      .pipe(map((response) => response.items));
  }

  public search(filters: FilterItem[]): Observable<SearchResult> {
    const params: HttpParams = new HttpParams().set(
      this.PARAM_LANGUAGE,
      this.localStorage.getItem('language')
    );

    const payload = this.prepareSearchPayload(filters);

    return this.httpClient.post<SearchResult>(
      `${API.v1}/${this.SEARCH}`,
      {
        filters: payload,
      },
      { params }
    );
  }

  public autocomplete(
    textSearch: string,
    filterName: string
  ): Observable<FilterItemIdValue> {
    const params = new HttpParams({ encoder: new HttpParamsEncoder() }).set(
      this.PARAM_SEARCH_FOR,
      textSearch
    );

    return this.httpClient.get<FilterItemIdValue>(
      `${API.v1}/${this.POSSIBLE_FILTER}/${filterName}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  public textSearch(_textSearch: any): Observable<SearchResult> {
    return of(new SearchResult([], [], 0));
  }

  public exportBoms(
    referenceTypesIdentifiers: ReferenceTypeIdentifier[]
  ): Observable<{ filename: string; content: Blob }> {
    const path = `${API.v1}/${BomExportPath}`;

    const headers = new HttpHeaders({
      responseType: 'blob',
      Accept: 'application/octet-stream',
      observe: 'response',
    });

    const response = firstValueFrom(
      this.httpClient
        .post(path, referenceTypesIdentifiers, {
          headers,
          observe: 'response',
          responseType: 'blob',
        })
        .pipe(
          timeout(BOM_EXPORT_TIMEOUT),
          map((res) => ({
            filename: this.getFileName(res.headers.get('content-disposition')),
            content: res.body,
          }))
        )
    );

    return from(response);
  }

  private getFileName(contentDispositionHeader: string): string {
    return contentDispositionHeader
      .split(';')[1]
      .split('filename')[1]
      .split('=')[1]
      .trim();
  }

  private prepareSearchPayload(
    filters: FilterItem[]
  ): (FilterItemIdValueUpdate | FilterItemRangeUpdate)[] {
    return filters
      .map((filter) => {
        switch (filter.type) {
          case FilterItemType.ID_VALUE: {
            const ids = (filter as FilterItemIdValue).selectedItems.map(
              (item) => item.id as string
            );

            return new FilterItemIdValueUpdate(filter.name, ids);
          }
          case FilterItemType.RANGE: {
            return new FilterItemRangeUpdate(
              filter.name,
              (filter as FilterItemRange).minSelected,
              (filter as FilterItemRange).maxSelected
            );
          }
          default: {
            return undefined;
          }
        }
      })
      .filter((item) => item !== undefined);
  }
}
