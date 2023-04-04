import { createAction, props } from '@ngrx/store';

import { CalculationParametersOperationConditions } from '../../models/calculation-parameters-state.model';

export const operatingParameters = createAction(
  '[Calculation Parameters] Operating Parameters',
  props<{
    operationConditions: Partial<CalculationParametersOperationConditions>;
  }>()
);

export const resetCalculationParameters = createAction(
  '[Calculation Parameters] Reset Operating Parameters'
);
