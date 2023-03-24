import { createAction, props } from '@ngrx/store';

import { CalculationResultState } from '../../models/calculation-result-state.model';

export const getCalculationResult = createAction(
  '[Calculation Result] Get Calculation Result',
  props<{ result: CalculationResultState }>()
);
