import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import { DataService } from '@schaeffler/http';

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
  private readonly PARAM_ENABLE_CACHE = 'cache$';

  public constructor(
    private readonly dataService: DataService,
    private readonly searchUtilities: SearchUtilityService
  ) {}

  public getInitialFilters(): Observable<FilterItem[]> {
    return this.dataService
      .getAll<InitialFiltersResponse>(this.INITIAL_FILTER, withCache())
      .pipe(map((response) => response.items));
  }

  public search(
    items: (FilterItemRangeUpdate | FilterItemIdValueUpdate)[]
  ): Observable<SearchResult> {
    return this.dataService.post<SearchResult>(this.SEARCH, { items });
  }

  public autocomplete(
    textSearch: TextSearch,
    selectedOptions: IdValue[]
  ): Observable<FilterItemIdValue> {
    const params = new HttpParams()
      .set(this.PARAM_SEARCH_FOR, textSearch.value)
      .set(this.PARAM_ENABLE_CACHE, 'true');

    return this.dataService
      .getAll<FilterItemIdValue>(
        `${this.POSSIBLE_FILTER}/${textSearch.field}`,
        { params }
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
