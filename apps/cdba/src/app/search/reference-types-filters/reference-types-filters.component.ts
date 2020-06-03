import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { autocomplete, search, updateFilter } from '../../core/store';
import {
  FilterItem,
  FilterItemType,
  TextSearch,
} from '../../core/store/reducers/search/models';
import { SearchState } from '../../core/store/reducers/search/search.reducer';
import {
  getAutocompleteLoading,
  getFilters,
} from '../../core/store/selectors/search/search.selector';

@Component({
  selector: 'cdba-reference-types-filters',
  templateUrl: './reference-types-filters.component.html',
})
export class ReferenceTypesFiltersComponent implements OnInit {
  filters$: Observable<FilterItem[]>;

  // can be used for all filters for now since only one filter can be opened anyway
  autocompleteLoading$: Observable<boolean>;

  filterType = FilterItemType;

  public constructor(private readonly store: Store<SearchState>) {}

  public ngOnInit(): void {
    this.filters$ = this.store.pipe(select(getFilters));
    this.autocompleteLoading$ = this.store.pipe(select(getAutocompleteLoading));
  }

  /**
   * Updates the given filter
   */
  public updateFilter(filter: FilterItem): void {
    this.store.dispatch(updateFilter({ item: filter }));
  }

  /**
   * Get possible values for user input.
   */
  public autocomplete(textSearch: TextSearch): void {
    this.store.dispatch(autocomplete({ textSearch }));
  }

  /**
   * Search with currently selected filters
   */
  public search(): void {
    this.store.dispatch(search());
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
