import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getReferenceTypes,
  getResultCount,
  getSearchSuccessful,
  getTooManyResults,
} from '../core/store';
import { SearchState } from '../core/store/reducers/search/search.reducer';
import { ReferenceType } from '../core/store/reducers/shared/models';

@Component({
  selector: 'cdba-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchSuccessful$: Observable<boolean>;
  tooManyResults$: Observable<boolean>;
  referenceTypesData$: Observable<ReferenceType[]>;
  resultCount$: Observable<number>;

  public constructor(private readonly store: Store<SearchState>) {}

  ngOnInit(): void {
    this.searchSuccessful$ = this.store.pipe(select(getSearchSuccessful));
    this.tooManyResults$ = this.store.pipe(select(getTooManyResults));
    this.referenceTypesData$ = this.store.pipe(select(getReferenceTypes));
    this.resultCount$ = this.store.pipe(select(getResultCount));
  }
}
