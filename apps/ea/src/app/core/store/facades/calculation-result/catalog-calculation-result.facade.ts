import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { CatalogCalculationResultSelector } from '../../selectors/calculation-result';

@Injectable({
  providedIn: 'root',
})
export class CatalogCalculationResultFacade {
  public basicFrequencies$ = this.store.select(
    CatalogCalculationResultSelector.getBasicFrequencies
  );
  public isLoading$ = this.store.select(
    CatalogCalculationResultSelector.isLoading
  );

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
