import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  autocomplete,
  removeFilter,
  search,
  updateFilter,
} from '../../core/store';
import {
  FilterItem,
  FilterItemType,
  TextSearch,
} from '../../core/store/reducers/search/models';
import { SearchState } from '../../core/store/reducers/search/search.reducer';
import { getAllFilters } from '../../core/store/selectors/search/search.selector';

@Component({
  selector: 'cdba-reference-types-filters',
  templateUrl: './reference-types-filters.component.html',
})
export class ReferenceTypesFiltersComponent implements OnInit {
  filters$: Observable<FilterItem[]>;

  filterType = FilterItemType;

  public constructor(private readonly store: Store<SearchState>) {}

  public ngOnInit(): void {
    this.filters$ = this.store.pipe(select(getAllFilters));
  }

  /**
   * Removes the given filter entirely from the selected ones
   */
  public removeFilter(name: string): void {
    this.store.dispatch(removeFilter({ name }));
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
