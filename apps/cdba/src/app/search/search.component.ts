import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getReferenceTypes, getSearchSuccessful } from '../core/store';
import { ReferenceType } from '../core/store/reducers/search/models';
import { SearchState } from '../core/store/reducers/search/search.reducer';

@Component({
  selector: 'cdba-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchSuccessful$: Observable<boolean>;
  referenceTypesData$: Observable<ReferenceType[]>;

  public constructor(private readonly store: Store<SearchState>) {}

  ngOnInit(): void {
    this.searchSuccessful$ = this.store.pipe(select(getSearchSuccessful));
    this.referenceTypesData$ = this.store.pipe(select(getReferenceTypes));
  }
}
