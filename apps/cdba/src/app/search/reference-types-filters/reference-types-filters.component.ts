import { Component, OnInit } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { search } from '../../core/store';
import {
  FilterItem,
  FilterItemIdValue,
  FilterItemRange,
  FilterItemType,
} from '../../core/store/reducers/search/models';
import { SearchState } from '../../core/store/reducers/search/search.reducer';
import {
  getPossibleFilters,
  getSelectedFilters,
} from '../../core/store/selectors/search/search.selector';

@Component({
  selector: 'cdba-reference-types-filters',
  templateUrl: './reference-types-filters.component.html',
})
export class ReferenceTypesFiltersComponent implements OnInit {
  filters$: Observable<FilterItem[]>;

  filterType = FilterItemType;

  private static selectIdValuesInFilter(
    filter: FilterItemIdValue,
    selectedFilter: FilterItemIdValue
  ): void {
    selectedFilter.items.forEach((item) => {
      const found = filter.items.filter((it) => it.id === item.id)[0];
      if (found) {
        found.selected = item.selected;
      }
    });
  }

  private static selectRangeInFilter(
    filter: FilterItemRange,
    selectedFilter: FilterItemRange
  ): void {
    filter.minSelected = selectedFilter.minSelected;
    filter.maxSelected = selectedFilter.maxSelected;
  }

  public constructor(private readonly store: Store<SearchState>) {}

  ngOnInit(): void {
    this.mergePossibleAndSelectedFilters();
  }

  /**
   * Combine possible and selected filters
   */
  public mergePossibleAndSelectedFilters(): void {
    this.filters$ = combineLatest([
      this.store.pipe(select(getPossibleFilters)),
      this.store.pipe(select(getSelectedFilters)),
    ]).pipe(
      map(([possibleFilters, selectedFilters]) => {
        const filters = [...possibleFilters];

        filters.forEach((filter) => {
          // check if this filter has selections
          const selectedFilter = selectedFilters.find(
            (f) => f.name === filter.name
          );

          if (selectedFilter) {
            // set selected value(s) dependent on filter item type
            if (filter.type === FilterItemType.ID_VALUE) {
              ReferenceTypesFiltersComponent.selectIdValuesInFilter(
                filter as FilterItemIdValue,
                selectedFilter as FilterItemIdValue
              );
            } else if (filter.type === FilterItemType.RANGE) {
              ReferenceTypesFiltersComponent.selectRangeInFilter(
                filter as FilterItemRange,
                selectedFilter as FilterItemRange
              );
            }
          }
        });

        return filters;
      })
    );
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
