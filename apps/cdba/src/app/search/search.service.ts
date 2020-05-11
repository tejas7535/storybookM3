import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../core/http/data.service';
import {
  FilterItem,
  SearchResult,
  TextSearch,
} from '../core/store/reducers/search/models';
import { InitialFiltersResponse } from './initial-filters-response.model';
import { SearchResponse } from './search-response.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public constructor(private readonly dataService: DataService) {}

  public getInitialFiltersSales(): Observable<FilterItem[]> {
    return this.dataService
      .getAll<InitialFiltersResponse>('initial-filter-sales')
      .pipe(map((response) => response.items));
  }

  public search(items: FilterItem[]): Observable<SearchResult> {
    return this.dataService
      .post<SearchResponse>('search-sales', { items })
      .pipe(
        map((response) => ({
          possible: response.possibleFilters,
          result: response.result,
        }))
      );
  }

  public autocomplete(textSearch: TextSearch): Observable<FilterItem> {
    const httpParams = new HttpParams().set('search_for', textSearch.value);

    return this.dataService.getAll<FilterItem>(
      `possible-filter/${textSearch.field}`,
      httpParams
    );
  }

  public textSearch(_textSearch: any): Observable<SearchResult> {
    return of(new SearchResult([], []));
  }
}
