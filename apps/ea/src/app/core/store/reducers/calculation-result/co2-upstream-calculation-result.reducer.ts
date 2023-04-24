import { Action, createReducer, on } from '@ngrx/store';

import { CO2UpstreamCalculationResultActions } from '../../actions';
import { CO2UpstreamCalculationResultState } from '../../models/co2-upstream-calculation-result-state.model';

export const initialState: CO2UpstreamCalculationResultState = {
  isLoading: false,
};

export const co2UpstreamCalculationResultReducer = createReducer(
  initialState,
  on(
    CO2UpstreamCalculationResultActions.fetchResult,
    (state): CO2UpstreamCalculationResultState => ({
      ...state,
      isLoading: true,
    })
  ),

  on(
    CO2UpstreamCalculationResultActions.setCalculationResult,
    (state, { calculationResult }): CO2UpstreamCalculationResultState => ({
      ...state,
      calculationResult,
      isLoading: false,
      calculationError: undefined,
    })
  ),

  on(
    CO2UpstreamCalculationResultActions.setCalculationFailure,
    (state, { error }): CO2UpstreamCalculationResultState => ({
      ...state,
      calculationError: error,
      isLoading: false,
    })
  )
);

export function reducer(
  state: CO2UpstreamCalculationResultState,
  action: Action
): CO2UpstreamCalculationResultState {
  return co2UpstreamCalculationResultReducer(state, action);
}
