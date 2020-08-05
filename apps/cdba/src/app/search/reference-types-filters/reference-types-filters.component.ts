import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

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
  getIsDirty,
} from '../../core/store/selectors/search/search.selector';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from './range-filter/range-filter.component';

@Component({
  selector: 'cdba-reference-types-filters',
  templateUrl: './reference-types-filters.component.html',
})
export class ReferenceTypesFiltersComponent implements OnInit {
  @ViewChildren(MultiSelectFilterComponent) multiSelectFilters: QueryList<
    MultiSelectFilterComponent
  >;
  @ViewChildren(RangeFilterComponent) rangeFilters: QueryList<
    RangeFilterComponent
  >;

  filters$: Observable<FilterItem[]>;

  // can be used for all filters for now since only one filter can be opened anyway
  autocompleteLoading$: Observable<boolean>;
  tooManyResults$: Observable<boolean>;
  searchSuccessful$: Observable<boolean>;
  showResetButton$: Observable<boolean>;

  filterType = FilterItemType;

  public constructor(private readonly store: Store<SearchState>) {}

  public ngOnInit(): void {
    this.filters$ = this.store.pipe(select(getFilters));
    this.autocompleteLoading$ = this.store.pipe(select(getAutocompleteLoading));
    this.searchSuccessful$ = this.store.pipe(select(getSearchSuccessful));
    this.tooManyResults$ = this.store.pipe(select(getTooManyResults));
    this.showResetButton$ = this.store.pipe(select(getIsDirty));
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
  public trackByFn(_index: number, item: FilterItem): string {
    return item.name;
  }

  /**
   * Reset the Filter to its initial state.
   */
  public resetFilters(): void {
    this.store.dispatch(resetFilters());
    this.multiSelectFilters.forEach((filter) => filter.reset());
    this.rangeFilters.forEach((filter) => filter.reset());
  }
}
