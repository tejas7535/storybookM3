import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  autocomplete,
  getSearchSuccessful,
  getTooManyResults,
  resetFilters,
  search,
  updateFilter,
} from '../../core/store';
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
  tooManyResults$: Observable<boolean>;
  searchSuccessful$: Observable<boolean>;

  filterType = FilterItemType;
  showResetButton: boolean;

  public constructor(private readonly store: Store<SearchState>) {}

  public ngOnInit(): void {
    this.filters$ = this.store.pipe(select(getFilters));
    this.autocompleteLoading$ = this.store.pipe(select(getAutocompleteLoading));
    this.searchSuccessful$ = this.store.pipe(select(getSearchSuccessful));
    this.tooManyResults$ = this.store.pipe(select(getTooManyResults));
  }

  /**
   * Updates the given filter
   */
  public updateFilter(filter: FilterItem): void {
    this.store.dispatch(updateFilter({ item: filter }));
    this.showResetButton = true;
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

  /**
   * Reset the Filter to its initial state.
   */
  public resetFilters(): void {
    this.store.dispatch(resetFilters());
    this.showResetButton = false;
  }
}
