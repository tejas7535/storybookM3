import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService, GetOptions } from '@schaeffler/http';

import {
  AutocompleteResponse,
  AutocompleteSearch,
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
    const options: GetOptions = {
      params: httpParams,
    };
    const filterPath = autocompleteSearch.filter.toLowerCase();

    return this.dataService
      .getAll<AutocompleteResponse>(
        `${this.AUTO_COMPLETE}/${filterPath}`,
        options
      )
      .pipe(
        map((res: AutocompleteResponse) =>
          res.items.map((opt: IdValue) => ({
            ...opt,
            selected: false,
          }))
        )
      );
  }
}
