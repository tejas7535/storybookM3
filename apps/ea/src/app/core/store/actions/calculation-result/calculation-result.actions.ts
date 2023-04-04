import { createAction, props } from '@ngrx/store';

import { CalculationResult } from '../../models';

export const createModel = createAction('[Calculation Result] Create Model');

export const setModelId = createAction(
  '[Calculation Result] Set Model Id',
  props<{ modelId: string }>()
);

export const setCalculationId = createAction(
  '[Calculation Result] Set Calculation Id',
  props<{ calculationId: string }>()
);

export const updateModel = createAction('[Calculation Result] Update Model');

export const calculateModel = createAction(
  '[Calculation Result] Calculate Model'
);

export const fetchCalculationResult = createAction(
  '[Calculation Result] Fetch Calculation Result'
);

export const setCalculationResult = createAction(
  '[Calculation Result] Set Calculation Result',
  props<{ calculationResult: CalculationResult }>()
);

export const setCalculationFailure = createAction(
  '[Calculation Result] Set Calculation Failure',
  props<{ error: string }>()
);

export const setCalculationImpossible = createAction(
  '[Calculation Result] Set Calculation Impossible',
  props<{ isCalculationImpossible: boolean }>()
);
