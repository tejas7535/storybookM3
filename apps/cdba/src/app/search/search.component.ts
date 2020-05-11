import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getSearchSuccessful } from '../core/store';
import { SearchState } from '../core/store/reducers/search/search.reducer';

@Component({
  selector: 'cdba-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchSuccessful$: Observable<boolean>;

  public constructor(private readonly store: Store<SearchState>) {}

  ngOnInit(): void {
    this.searchSuccessful$ = this.store.pipe(select(getSearchSuccessful));
  }
}
