import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ReferenceType } from '@cdba/shared/models';

import {
  getReferenceTypes,
  getReferenceTypesLoading,
  getResultCount,
  getSearchSuccessful,
  getTooManyResults,
  selectReferenceTypes,
} from '../core/store';

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
  loading$: Observable<boolean>;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.searchSuccessful$ = this.store.select(getSearchSuccessful);
    this.tooManyResults$ = this.store.select(getTooManyResults);
    this.referenceTypesData$ = this.store.select(getReferenceTypes);
    this.resultCount$ = this.store.select(getResultCount);
    this.loading$ = this.store.select(getReferenceTypesLoading);
  }

  selectReferenceTypes(nodeIds: string[]): void {
    this.store.dispatch(selectReferenceTypes({ nodeIds }));
  }
}
