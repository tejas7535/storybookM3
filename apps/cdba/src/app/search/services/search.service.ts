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
  FilterItemType,
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
    private readonly dataService: DataService,
    private readonly searchUtilities: SearchUtilityService
  ) {}

  public getInitialFilters(): Observable<FilterItem[]> {
    return this.dataService
      .getAll<InitialFiltersResponse>(this.INITIAL_FILTER)
      .pipe(map((response) => response.items));
  }

  public search(
    items: (FilterItemRangeUpdate | FilterItemIdValueUpdate)[]
  ): Observable<SearchResult> {
    return this.dataService
      .post<SearchResult>(this.SEARCH, { items })
      .pipe(
        map((result: SearchResult) => ({
          ...result,
          filters: result.filters.filter(
            (filterItem: FilterItem) =>
              filterItem.type === FilterItemType.ID_VALUE
          ),
        }))
      );
  }

  public autocomplete(
    textSearch: TextSearch,
    selectedOptions: IdValue[]
  ): Observable<FilterItemIdValue> {
    const httpParams = new HttpParams().set(
      this.PARAM_SEARCH_FOR,
      textSearch.value
    );

    return this.dataService
      .getAll<FilterItemIdValue>(
        `${this.POSSIBLE_FILTER}/${textSearch.field}`,
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
    return of(new SearchResult([], [], 0));
  }
}
