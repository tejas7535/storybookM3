import { createReducer, on } from '@ngrx/store';

import { CalculationResultActions } from '../../actions/calculation-result';
import {
  setBearinxVersions,
  unsetBearinxVersions,
} from '../../actions/calculation-result/calculation-result.actions';
import { CalculationResultState } from '../../models/calculation-result-state.model';

export const initialState: CalculationResultState = {
  isLoading: false,
};

export const calculationResultReducer = createReducer(
  initialState,
  on(
    CalculationResultActions.calculateResult,
    (state): CalculationResultState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    CalculationResultActions.setCalculationResult,
    (state, { result }): CalculationResultState => ({
      ...state,
      isLoading: false,
      result,
    })
  ),
  on(
    CalculationResultActions.calculateResultFailure,
    (state): CalculationResultState => ({
      ...state,
      isLoading: false,
    })
  ),
  on(
    CalculationResultActions.resetCalculationResult,
    (state): CalculationResultState => ({
      ...state,
      result: undefined,
    })
  ),
  on(
    setBearinxVersions,
    (state, { versions }): CalculationResultState => ({
      ...state,
      versions,
    })
  ),
  on(
    unsetBearinxVersions,
    (state): CalculationResultState => ({
      ...state,
      versions: undefined,
    })
  )
);
