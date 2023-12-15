import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getNoResultsFound,
  getReferenceTypesLoading,
  getResultCount,
  getTooManyResults,
  getTooManyResultsThreshold,
} from '../core/store';

@Component({
  selector: 'cdba-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  loading$: Observable<boolean>;
  tooManyResults$: Observable<boolean>;
  noResultsFound$: Observable<boolean>;
  resultCount$: Observable<number>;
  tooManyResultsThreshold$: Observable<number>;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(getReferenceTypesLoading);
    this.tooManyResults$ = this.store.select(getTooManyResults);
    this.noResultsFound$ = this.store.select(getNoResultsFound);
    this.resultCount$ = this.store.select(getResultCount);
    this.tooManyResultsThreshold$ = this.store.select(
      getTooManyResultsThreshold
    );
  }
}
