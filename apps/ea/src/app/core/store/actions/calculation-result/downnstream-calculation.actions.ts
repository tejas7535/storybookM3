import {
  DownstreamApiInputs,
  DownstreamAPIResponse,
} from '@ea/core/services/downstream-calculation.service.interface';
import { createAction, props } from '@ngrx/store';

export const fetchDownstreamCalculation = createAction(
  '[Downstream Calculation] Fetch calculation results'
);

export const resetDownstreamCalculation = createAction(
  '[Downstream Calculation] Reset calculation results'
);

export const setDownstreamCalculationResult = createAction(
  '[Downstream Calculation] Set results',
  props<{ result: DownstreamAPIResponse; inputs: DownstreamApiInputs }>()
);

export const setCalculationFailure = createAction(
  '[Downstream Calculation] Set calculation error',
  props<{ errors: string[] }>()
);
