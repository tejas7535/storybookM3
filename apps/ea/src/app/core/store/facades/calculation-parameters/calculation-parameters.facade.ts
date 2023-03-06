import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { getOperationConditions } from '../../selectors/calculation-parameters/calculation-parameters.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationParamtersFacade {
  public calculationParameters$ = this.store.select(getOperationConditions);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
