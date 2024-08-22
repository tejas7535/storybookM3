import { createAction, props } from '@ngrx/store';

import { CalculationResult } from '../../models/calculation-result-state.model';

export const fetchCalculationJsonResult = createAction(
  '[CalculationResult] Fetch Calculation JSON Result',
  props<{ jsonReportUrl: string }>()
);

export const setCalculationJsonResult = createAction(
  '[CalculationResult] Set Calculation JSON Result',
  props<{ result: CalculationResult }>()
);

export const fetchCalculationJsonResultFailure = createAction(
  '[CalculationResult] Fetch Calculation JSON Result Failure',
  props<{ error: string }>()
);
