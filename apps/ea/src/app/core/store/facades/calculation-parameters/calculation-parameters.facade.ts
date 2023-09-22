import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { getCalculationFieldsConfig } from '../../selectors/calculation-parameters/calculation-fields.selector';
import {
  getOperationConditions,
  isCalculationMissingInput,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';
import {
  getCalculationTypes,
  getCalculationTypesConfig,
  getCalculationTypesGlobalSelectionState,
} from '../../selectors/calculation-parameters/calculation-types.selector';
import { isAnyServiceLoading } from '../../selectors/calculation-result/calculation-result-preview.selector';

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

  public getCalculationTypes$ = this.store.select(getCalculationTypes);

  public getCalculationTypesGlobalSelection$ = this.store.select(
    getCalculationTypesGlobalSelectionState
  );

  public getCalculationFieldsConfig$ = this.store.select(
    getCalculationFieldsConfig
  );

  public isAnyServiceLoading$ = this.store.select(isAnyServiceLoading);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
