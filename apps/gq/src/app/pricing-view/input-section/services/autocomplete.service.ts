import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../../core/http/data.service';
import {
  AutocompleteSearch,
  FilterItem,
  IdValue,
} from '../../../core/store/models';

/**
 *  Auto-complete service
 */

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private readonly PARAM_SEARCH_FOR = 'search_for';
  private readonly AUTO_COMPLETE = 'auto-complete';

  constructor(private readonly dataService: DataService) {}

  public autocomplete(
    autocompleteSearch: AutocompleteSearch
  ): Observable<IdValue[]> {
    const httpParams = new HttpParams().set(
      this.PARAM_SEARCH_FOR,
      autocompleteSearch.searchFor
    );

    const filterPath = autocompleteSearch.filter.toLowerCase();

    return this.dataService
      .getAll<FilterItem>(`${this.AUTO_COMPLETE}/${filterPath}`, httpParams)
      .pipe(
        map((item: FilterItem) =>
          item.options.map((option) => ({
            ...option,
            selected: false,
          }))
        )
      );
  }
}
