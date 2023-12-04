import { createAction, props } from '@ngrx/store';

import { CalculationParametersOperationConditions } from '../../models/calculation-parameters-state.model';

export const operatingParameters = createAction(
  '[Calculation Parameters] Operating Parameters',
  props<{
    operationConditions: Partial<CalculationParametersOperationConditions>;
    isValid?: boolean;
  }>()
);

export const setIsInputInvalid = createAction(
  '[Calculation Parameters] Is Missing Input',
  props<{
    isInputInvalid: boolean;
  }>()
);

export const resetCalculationParameters = createAction(
  '[Calculation Parameters] Reset Operating Parameters'
);

export const setSelectedLoadcase = createAction(
  '[Calculation Parameters] Set Selected Loadcase',
  props<{
    selectedLoadcase: number;
  }>()
);
