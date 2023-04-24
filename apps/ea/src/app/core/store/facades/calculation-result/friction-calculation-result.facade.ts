import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { FrictionCalculationResultSelector } from '../../selectors/calculation-result';

@Injectable({
  providedIn: 'root',
})
export class FrictionCalculationResultFacade {
  public modelId$ = this.store.select(
    FrictionCalculationResultSelector.getModelId
  );
  public calculationId$ = this.store.select(
    FrictionCalculationResultSelector.getCalculationId
  );

  public isCalculationImpossible$ = this.store.select(
    FrictionCalculationResultSelector.isCalculationImpossible
  );

  public isLoading$ = this.store.select(
    FrictionCalculationResultSelector.isLoading
  );

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
