import { createAction, props } from '@ngrx/store';

export const getCalculation = createAction(
  '[Calculation Result] Get Calculation'
);

export const calculationSuccess = createAction(
  '[Calculation Result] Get Calculation Success',
  props<{ resultId: string }>()
);

export const calculationError = createAction(
  '[Calculation Result] Get Calculation Error'
);
