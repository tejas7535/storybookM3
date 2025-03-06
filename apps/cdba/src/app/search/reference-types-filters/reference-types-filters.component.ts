import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  autocomplete,
  getChangedFilters,
  getChangedIdValueFilters,
  getFilters,
  getTooManyResultsThreshold,
  loadInitialFilters,
  resetFilters,
  search,
  updateFilter,
} from '../../core/store';
import {
  FilterItem,
  FilterItemType,
} from '../../core/store/reducers/search/models';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from './range-filter/range-filter.component';

@Component({
  selector: 'cdba-reference-types-filters',
  templateUrl: './reference-types-filters.component.html',
  standalone: false,
})
export class ReferenceTypesFiltersComponent implements OnInit, OnDestroy {
  @ViewChildren(MultiSelectFilterComponent)
  multiSelectFilters: QueryList<MultiSelectFilterComponent>;

  @ViewChildren(RangeFilterComponent)
  rangeFilters: QueryList<RangeFilterComponent>;

  filtersSubscription: Subscription;

  filters$: Observable<FilterItem[]>;
  selectedFilters$ = this.store.select(getChangedFilters);
  selectedIdValueFilters$ = this.store.select(getChangedIdValueFilters);

  tooManyResultsThreshold$: Observable<number> = this.store.select(
    getTooManyResultsThreshold
  );
  filterType = FilterItemType;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.filters$ = this.store.select(getFilters);

    this.filtersSubscription = this.filters$.subscribe((filters) => {
      if (!filters || filters.length === 0) {
        this.store.dispatch(loadInitialFilters());
      }
    });
  }

  ngOnDestroy(): void {
    if (this.filtersSubscription) {
      this.filtersSubscription.unsubscribe();
    }
  }

  /**
   * Updates the given filter
   */
  updateFilter(filter: FilterItem): void {
    this.store.dispatch(updateFilter({ filter }));
  }

  /**
   * Get possible values for user input.
   */
  autocomplete(evt: { searchFor: string; filter: FilterItem }): void {
    this.store.dispatch(
      autocomplete({ searchFor: evt.searchFor, filter: evt.filter })
    );
  }

  /**
   * Search with currently selected filters
   */
  search(): void {
    this.store.dispatch(search());
  }

  /**
   * Reset the Filter to its initial state.
   */
  resetFilters(): void {
    this.multiSelectFilters.forEach((filter) => filter.reset());
    this.rangeFilters.forEach((filter) => filter.reset());
    this.store.dispatch(resetFilters());
  }
}
