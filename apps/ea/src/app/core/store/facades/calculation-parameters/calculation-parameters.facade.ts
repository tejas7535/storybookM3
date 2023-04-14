import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  getEnergySource,
  getOperationConditions,
  isCalculationMissingInput,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';
import {
  getCalculationTypesConfig,
  getCalculationTypesGlobalSelectionState,
} from '../../selectors/calculation-parameters/calculation-types.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationParametersFacade {
  public readonly operationConditions$ = this.store.select(
    getOperationConditions
  );

  public isCalculationMissingInput$ = this.store.select(
    isCalculationMissingInput
  );

  public getCalculationTypesConfig$ = this.store.select(
    getCalculationTypesConfig
  );

  public getCalculationTypesGlobalSelection$ = this.store.select(
    getCalculationTypesGlobalSelectionState
  );

  public readonly energySource$ = this.store.select(getEnergySource);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
