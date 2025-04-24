import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { ShaftMaterialResponse } from '@mm/shared/models';
import { CalculationOptionsFormData } from '@mm/steps/calculation-options-step/calculation-selection-step.interface';
import { createAction, props } from '@ngrx/store';

export const fetchPreflightOptions = createAction(
  '[CalculationOptions] Fetch preflight options'
);

export const setCalculationOptions = createAction(
  '[CalculationOptions] Set Options',
  props<{ options: PreflightData }>()
);

export const setCalculationPerformed = createAction(
  '[CalculationOptions] Set calculation performed',
  props<{ performed: boolean }>()
);

export const calculateResultFromOptions = createAction(
  '[CalculationOptions] Calculate result from options'
);

export const updateShaftMaterialInformation = createAction(
  '[CalculationOptions] Update shaft material information Options',
  props<{ selectedOption: string }>()
);

export const setShaftMaterialInformation = createAction(
  '[CalculationOptions] Set shaft material information',
  props<{ shaftMaterialData: ShaftMaterialResponse }>()
);

export const updateOptionsFromFormData = createAction(
  '[CalculationOptions] Update options from form data',
  props<{ formData: CalculationOptionsFormData }>()
);

export const updateOptionsSuccess = createAction(
  '[CalculationOptions] Update options success'
);
