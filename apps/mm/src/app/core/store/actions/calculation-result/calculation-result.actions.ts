import { CalculationOptionsFormData } from '@mm/steps/calculation-options-step/calculation-selection-step.interface';
import { createAction, props } from '@ngrx/store';

import { CalculationParameters } from '../../models/calculation-parameters-state.model';
import { CalculationResult } from '../../models/calculation-result-state.model';

export const calculateResult = createAction(
  '[CalculationResult] Calculate Result'
);

export const calculateResultFromForm = createAction(
  '[CalculationResult] Calculate Result from form',
  props<{ formData: CalculationOptionsFormData }>()
);

export const fetchCalculationResultResourcesLinks = createAction(
  '[CalculationResult] Fetch Calculation Result Resources Links',
  props<{ formProperties: CalculationParameters }>()
);

export const fetchCalculationResultResourcesLinksFailure = createAction(
  '[CalculationResult] Fetch Calculation Result Resources Links Failure',
  props<{ error: string }>()
);

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

export const setCalculationHtmlBodyUrlResult = createAction(
  '[CalculationResult] Set Calculation Html Body url',
  props<{ htmlBodyUrl: string }>()
);
