import { createAction, props } from '@ngrx/store';

import { CalculationParametersCalculationTypes } from '../../models';

export const setCalculationTypes = createAction(
  '[Calculation Types] Set calculation types',
  props<{ calculationTypes: CalculationParametersCalculationTypes }>()
);

export const selectAll = createAction(
  '[Calculation Types] Select all',
  props<{ selectAll: boolean }>()
);

export const selectType = createAction(
  '[Calculation Types] Select type',
  props<{
    calculationType: keyof CalculationParametersCalculationTypes;
    select: boolean;
  }>()
);
