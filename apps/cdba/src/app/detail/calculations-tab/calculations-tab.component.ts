import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { SearchState } from '../../core/store/reducers/search/search.reducer';
import { Calculation } from '../../core/store/reducers/shared/models/calculation.model';
import {
  getCalculations,
  getCalculationsErrorMessage,
  getCalculationsLoading,
} from '../../core/store/selectors';

@Component({
  selector: 'cdba-calculations-tab',
  templateUrl: './calculations-tab.component.html',
  styleUrls: ['./calculations-tab.component.scss'],
})
export class CalculationsTabComponent implements OnInit {
  calculations$: Observable<Calculation[]>;
  loading$: Observable<boolean>;
  errorMessage$: Observable<string>;

  public constructor(private readonly store: Store<SearchState>) {}

  ngOnInit(): void {
    this.calculations$ = this.store.pipe(select(getCalculations));
    this.loading$ = this.store.pipe(select(getCalculationsLoading));
    this.errorMessage$ = this.store.pipe(select(getCalculationsErrorMessage));
  }
}
