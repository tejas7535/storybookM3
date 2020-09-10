import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { autocomplete, updateFilter } from '../../core/store/actions';
import { FilterItem, TextSearch } from '../../core/store/models';
import { SearchState } from '../../core/store/reducers/search/search.reducer';
import { getAutocompleteLoading, getFilters } from '../../core/store/selectors';

@Component({
  selector: 'gq-input-section',
  templateUrl: './input-section.component.html',
  styleUrls: ['./input-section.component.scss'],
})
export class InputSectionComponent implements OnInit {
  @ViewChild('autocomplete') autocompleteInput: ElementRef;

  autocompleteLoading$: Observable<boolean>;
  filters$: Observable<FilterItem[]>;
  filter: FilterItem;
  selectedFilter = 'customer';

  constructor(private readonly store: Store<SearchState>) {}

  public ngOnInit(): void {
    this.filters$ = this.store.pipe(select(getFilters));
    this.autocompleteLoading$ = this.store.pipe(select(getAutocompleteLoading));
    this.getFilter();
  }

  public getFilter(): void {
    this.filters$.subscribe((value: FilterItem[]) => {
      this.filter = value.find(
        (value1: FilterItem) => value1.filter === this.selectedFilter
      );
      if (!this.filter) {
        this.filter = new FilterItem(this.selectedFilter, []);
      }
    });
  }

  /**
   * Get possible values for user input.
   */
  public autocomplete(textSearch: TextSearch): void {
    this.store.dispatch(autocomplete({ textSearch }));
  }

  public updateFilter(filter: FilterItem): void {
    this.store.dispatch(updateFilter({ item: filter }));
  }
}
