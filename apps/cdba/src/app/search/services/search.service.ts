import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../core/http/data.service';
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
  public constructor(
    private readonly dataService: DataService,
    private readonly searchUtilities: SearchUtilityService
  ) {}

  public getInitialFilters(): Observable<FilterItem[]> {
    return this.dataService
      .getAll<InitialFiltersResponse>('initial-filter')
      .pipe(map((response) => response.items));
  }

  public search(
    items: (FilterItemRangeUpdate | FilterItemIdValueUpdate)[]
  ): Observable<SearchResult> {
    return this.dataService.post<SearchResult>('search', { items });
  }

  public autocomplete(
    textSearch: TextSearch,
    selectedOptions: IdValue[]
  ): Observable<FilterItemIdValue> {
    const httpParams = new HttpParams().set('search_for', textSearch.value);

    return this.dataService
      .getAll<FilterItemIdValue>(
        `possible-filter/${textSearch.field}`,
        httpParams
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
    return of(new SearchResult([], []));
  }
}
