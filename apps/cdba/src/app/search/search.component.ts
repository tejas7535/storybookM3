import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { TOO_MANY_RESULTS_THRESHOLD } from '@cdba/core/store/reducers/search/search.reducer';

import {
  getNoResultsFound,
  getReferenceTypesLoading,
  getResultCount,
  getTooManyResults,
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
  tooManyResultsThreshold: number = TOO_MANY_RESULTS_THRESHOLD;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(getReferenceTypesLoading);
    this.tooManyResults$ = this.store.select(getTooManyResults);
    this.noResultsFound$ = this.store.select(getNoResultsFound);
    this.resultCount$ = this.store.select(getResultCount);
  }
}
