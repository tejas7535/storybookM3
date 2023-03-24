import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  getOperationConditions,
  isCalculationMissingInput,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationParametersFacade {
  public readonly calculationParameters$ = this.store.select(
    getOperationConditions
  );
  public readonly isCalculationMissingInput$ = this.store.select(
    isCalculationMissingInput
  );

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
