import {
  Component,
  OnInit,
  QueryList,
  TrackByFunction,
  ViewChildren,
} from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  autocomplete,
  getAutocompleteLoading,
  getFilters,
  getSelectedFilters,
  resetFilters,
  search,
  updateFilter,
} from '../../core/store';
import {
  FilterItem,
  FilterItemIdValueUpdate,
  FilterItemRangeUpdate,
  FilterItemType,
  TextSearch,
} from '../../core/store/reducers/search/models';
import { TOO_MANY_RESULTS_THRESHOLD } from '../../core/store/reducers/search/search.reducer';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from './range-filter/range-filter.component';

@Component({
  selector: 'cdba-reference-types-filters',
  templateUrl: './reference-types-filters.component.html',
})
export class ReferenceTypesFiltersComponent implements OnInit {
  @ViewChildren(MultiSelectFilterComponent)
  multiSelectFilters: QueryList<MultiSelectFilterComponent>;
  @ViewChildren(RangeFilterComponent)
  rangeFilters: QueryList<RangeFilterComponent>;

  filters$: Observable<FilterItem[]>;

  // can be used for all filters for now since only one filter can be opened anyway
  autocompleteLoading$: Observable<boolean>;
  selectedFilters$: Observable<
    (FilterItemIdValueUpdate | FilterItemRangeUpdate)[]
  >;

  tooManyResultsThreshold: number = TOO_MANY_RESULTS_THRESHOLD;
  filterType = FilterItemType;

  trackByFn: TrackByFunction<FilterItem> = (
    _index: number,
    item: FilterItem
  ): string => item.name;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.filters$ = this.store.select(getFilters);
    this.autocompleteLoading$ = this.store.select(getAutocompleteLoading);
    this.selectedFilters$ = this.store.select(getSelectedFilters);
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
   * Reset the Filter to its initial state.
   */
  public resetFilters(): void {
    this.store.dispatch(resetFilters());
    this.multiSelectFilters.forEach((filter) => filter.reset());
    this.rangeFilters.forEach((filter) => filter.reset());
  }
}
