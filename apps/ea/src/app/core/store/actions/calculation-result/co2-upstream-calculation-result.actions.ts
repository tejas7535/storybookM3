import { createAction, props } from '@ngrx/store';

import { CO2UpstreamCalculationResult } from '../../models/co2-upstream-calculation-result-state.model';

export const setCalculationFailure = createAction(
  '[CO2 Upstream Calculation Result] Set Calculation Failure',
  props<{ error: string }>()
);

export const fetchResult = createAction(
  '[CO2 Upstream Calculation Result] Fetch Result'
);

export const setCalculationResult = createAction(
  '[CO2 Upstream Calculation Result] Set Calculation Result',
  props<{
    calculationResult: CO2UpstreamCalculationResult;
  }>()
);
