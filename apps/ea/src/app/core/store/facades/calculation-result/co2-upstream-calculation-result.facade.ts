import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { CO2UpstreamCalculationResultSelector } from '../../selectors/calculation-result';

@Injectable({
  providedIn: 'root',
})
export class CO2UpstreamCalculationResultFacade {
  public calculationResult$ = this.store.select(
    CO2UpstreamCalculationResultSelector.getCalculationResult
  );

  public isLoading$ = this.store.select(
    CO2UpstreamCalculationResultSelector.isLoading
  );

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
