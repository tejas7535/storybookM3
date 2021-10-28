import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import { API } from '@cdba/shared/constants/api';

import {
  FilterItem,
  FilterItemIdValue,
  FilterItemIdValueUpdate,
  FilterItemRangeUpdate,
  IdValue,
  SearchResult,
  TextSearch,
} from '../../core/store/reducers/search/models';
import { InitialFiltersResponse } from '../initial-filters-response.model';
import { SearchUtilityService } from './search-utility.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly INITIAL_FILTER = 'initial-filter';

  private readonly SEARCH = 'search';

  private readonly POSSIBLE_FILTER = 'possible-filter';
  private readonly PARAM_SEARCH_FOR = 'search_for';

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly searchUtilities: SearchUtilityService
  ) {}

  public getInitialFilters(): Observable<FilterItem[]> {
    return this.httpClient
      .get<InitialFiltersResponse>(`${API.v1}/${this.INITIAL_FILTER}`, {
        context: withCache(),
      })
      .pipe(map((response) => response.items));
  }

  public search(
    items: (FilterItemRangeUpdate | FilterItemIdValueUpdate)[]
  ): Observable<SearchResult> {
    return this.httpClient.post<SearchResult>(`${API.v1}/${this.SEARCH}`, {
      items,
    });
  }

  public autocomplete(
    textSearch: TextSearch,
    selectedOptions: IdValue[]
  ): Observable<FilterItemIdValue> {
    const params = new HttpParams().set(
      this.PARAM_SEARCH_FOR,
      textSearch.value
    );

    return this.httpClient
      .get<FilterItemIdValue>(
        `${API.v1}/${this.POSSIBLE_FILTER}/${textSearch.field}`,
        {
          params,
          context: withCache(),
        }
      )
      .pipe(
        map((item: FilterItemIdValue) => ({
          ...item,
          items: this.searchUtilities.mergeOptionsWithSelectedOptions(
            item.items,
            selectedOptions
          ),
        }))
      );
  }

  public textSearch(_textSearch: any): Observable<SearchResult> {
    return of(new SearchResult([], [], 0));
  }
}
