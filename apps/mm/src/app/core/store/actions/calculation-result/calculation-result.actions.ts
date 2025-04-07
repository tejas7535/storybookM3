import { CalculationOptionsFormData } from '@mm/steps/calculation-options-step/calculation-selection-step.interface';
import { createAction, props } from '@ngrx/store';

import { CalculationResult } from '../../models/calculation-result-state.model';

export const calculateResult = createAction(
  '[CalculationResult] Calculate Result'
);

export const calculateResultFromForm = createAction(
  '[CalculationResult] Calculate Result from form',
  props<{ formData: CalculationOptionsFormData }>()
);

export const calculateResultFailure = createAction(
  '[CalculationResult] Calculate Result Failure',
  props<{ error: string }>()
);

export const setCalculationResult = createAction(
  '[CalculationResult] Set Calculation Result',
  props<{ result: CalculationResult }>()
);

export const fetchBearinxVersions = createAction(
  '[CalculationResult] Fetch Bearinx Versions'
);

export const setBearinxVersions = createAction(
  '[CalculationResult] Set Bearinx Versions',
  props<{ versions: { [key: string]: string } }>()
);

export const unsetBearinxVersions = createAction(
  '[CalculationResult] Unset Bearinx Versions'
);
