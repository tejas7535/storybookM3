import { createAction, props } from '@ngrx/store';

import { FrictionCalculationResult } from '../../models/friction-calculation-result-state.model';

export const setCalculationFailure = createAction(
  '[Friction Calculation Result] Set Calculation Failure',
  props<{ error: string }>()
);

export const createModel = createAction(
  '[Friction Calculation Result] Create Model',
  props<{ forceRecreate?: boolean }>()
);

export const setModelId = createAction(
  '[Friction Calculation Result] Set Model Id',
  props<{ modelId: string }>()
);

export const setCalculationId = createAction(
  '[Friction Calculation Result] Set Calculation Id',
  props<{ calculationId: string }>()
);

export const updateModel = createAction(
  '[Friction Calculation Result] Update Model'
);

export const calculateModel = createAction(
  '[Friction Calculation Result] Calculate Model'
);

export const fetchCalculationResult = createAction(
  '[Friction Calculation Result] Fetch Calculation Result'
);

export const setCalculationResult = createAction(
  '[Friction Calculation Result] Set Calculation Result',
  props<{ calculationResult: FrictionCalculationResult }>()
);

export const setCalculationImpossible = createAction(
  '[Friction Calculation Result] Set Calculation Impossible',
  props<{ isCalculationImpossible: boolean }>()
);

export const setLoading = createAction(
  '[Friction Upstream Calculation Result] Set Loading',
  props<{ isLoading: boolean }>()
);
