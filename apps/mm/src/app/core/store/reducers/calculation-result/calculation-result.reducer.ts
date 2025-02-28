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
    CalculationResultActions.fetchCalculationResultResourcesLinks,
    (state): CalculationResultState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    CalculationResultActions.calculateResult,
    (state): CalculationResultState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    CalculationResultActions.fetchCalculationJsonResult,
    (state): CalculationResultState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    CalculationResultActions.setCalculationJsonResult,
    (state, { result }): CalculationResultState => ({
      ...state,
      isLoading: false,
      result,
    })
  ),
  on(
    CalculationResultActions.fetchCalculationJsonResultFailure,
    (state): CalculationResultState => ({
      ...state,
      isLoading: false,
    })
  ),
  on(
    CalculationResultActions.setCalculationHtmlBodyUrlResult,
    (state, { htmlBodyUrl }): CalculationResultState => ({
      ...state,
      isLoading: false,
      htmlBodyUrl,
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
