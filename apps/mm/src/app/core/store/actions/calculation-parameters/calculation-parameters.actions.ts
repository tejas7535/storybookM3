import { createAction, props } from '@ngrx/store';

import { CalculationParameters } from '../../models/calculation-parameters-state.model';

export const setCalculationParameters = createAction(
  '[Calculation Parameters] Set Calculation Parameters',
  props<{ parameters: CalculationParameters }>()
);
