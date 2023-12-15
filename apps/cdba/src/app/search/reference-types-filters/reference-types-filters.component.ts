import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  TrackByFunction,
  ViewChildren,
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { BetaFeature } from '@cdba/shared/constants/beta-feature';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import {
  autocomplete,
  getChangedFilters,
  getChangedIdValueFilters,
  getFilters,
  getFiltersWithoutLimit,
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
})
export class ReferenceTypesFiltersComponent implements OnInit, OnDestroy {
  @ViewChildren(MultiSelectFilterComponent)
  multiSelectFilters: QueryList<MultiSelectFilterComponent>;

  @ViewChildren(RangeFilterComponent)
  rangeFilters: QueryList<RangeFilterComponent>;

  LIMIT_FILTER_ENABLED = false;

  filtersSubscription: Subscription;

  filters$: Observable<FilterItem[]>;
  selectedFilters$ = this.store.select(getChangedFilters);
  selectedIdValueFilters$ = this.store.select(getChangedIdValueFilters);

  tooManyResultsThreshold$: Observable<number> = this.store.select(
    getTooManyResultsThreshold
  );
  filterType = FilterItemType;

  public constructor(
    private readonly store: Store,
    private readonly betaFeatureService: BetaFeatureService
  ) {}

  public ngOnInit(): void {
    this.LIMIT_FILTER_ENABLED = this.betaFeatureService.getBetaFeature(
      BetaFeature.LIMIT_FILTER
    );

    this.filters$ = this.LIMIT_FILTER_ENABLED
      ? this.store.select(getFilters)
      : this.store.select(getFiltersWithoutLimit);

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
  public updateFilter(filter: FilterItem): void {
    this.store.dispatch(updateFilter({ filter }));
  }

  /**
   * Get possible values for user input.
   */
  public autocomplete(evt: any): void {
    this.store.dispatch(
      autocomplete({ searchFor: evt.searchFor, filter: evt.filter })
    );
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
    this.multiSelectFilters.forEach((filter) => filter.reset());
    this.rangeFilters.forEach((filter) => filter.reset());
    this.store.dispatch(resetFilters());
  }

  trackByFn: TrackByFunction<FilterItem> = (
    _index: number,
    item: FilterItem
  ): string => item.name;
}
