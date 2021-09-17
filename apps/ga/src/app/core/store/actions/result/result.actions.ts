import { createAction, props, union } from '@ngrx/store';

export const getCalculation = createAction('[Result] Get Calculation');

export const calculationSuccess = createAction(
  '[Result] Get Calculation Success',
  props<{ resultId: string }>()
);

export const calculationError = createAction('[Result] Get Calculation Error');

const all = union({
  getCalculation,
  calculationSuccess,
  calculationError,
});

export type CalculationActions = typeof all;
