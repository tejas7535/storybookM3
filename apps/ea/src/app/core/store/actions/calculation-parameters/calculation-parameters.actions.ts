import { createAction, props } from '@ngrx/store';

import { CalculationParametersState } from '../../models/calculation-parameters-state.model';

export const operatingParameters = createAction(
  '[Calculation Parameters] Operating Parameters',
  props<{ parameters: CalculationParametersState }>()
);

export const resetCalculationParams = createAction(
  '[Calculation Parameters] Reset Operating Parameters'
);

export const runCalculation = createAction(
  '[Calculation Parameters] Run Calculation'
);
