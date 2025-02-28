import { createAction, props } from '@ngrx/store';

import { CalculationResultMessage } from '../../models';

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

export const setResultMessage = createAction(
  '[Calculation Result] Set result message',
  props<{ messages: CalculationResultMessage[] }>()
);

export const addResultMessage = createAction(
  '[Calculation Reuslt] Add result message',
  props<{ message: CalculationResultMessage }>()
);
export const fetchBearinxVersions = createAction(
  '[Calculation Result] Fetch Bearinx Versions'
);

export const setBearinxVersions = createAction(
  '[Calculation Result] Set Bearinx Versions',
  props<{ versions: { [key: string]: string } }>()
);

export const unsetBearinxVersions = createAction(
  '[Calculation Result] Unset Bearinx Versions'
);
