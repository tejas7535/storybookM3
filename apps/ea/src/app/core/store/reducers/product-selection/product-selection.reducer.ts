import { Action, createReducer, on } from '@ngrx/store';

import { ProductSelectionActions } from '../../actions';
import { ProductSelectionState } from '../../models';

export const initialState: ProductSelectionState = {};

export const productSelectionReducer = createReducer(
  initialState,
  on(
    ProductSelectionActions.setBearingDesignation,
    (state, { bearingDesignation }): ProductSelectionState => ({
      ...state,
      bearingDesignation,
      bearingId: undefined, // reset bearing id
      error: undefined,
    })
  ),
  on(
    ProductSelectionActions.setBearingId,
    (state, { bearingId }): ProductSelectionState => ({
      ...state,
      bearingId,
      error: undefined,
    })
  ),
  on(
    ProductSelectionActions.setCalculationModuleInfo,
    (state, { calculationModuleInfo }): ProductSelectionState => ({
      ...state,
      calculationModuleInfo,
      error: {
        ...state.error,
        moduleInfoApi: undefined,
      },
    })
  ),
  on(
    ProductSelectionActions.setProductFetchFailure,
    (state, { error }): ProductSelectionState => ({
      ...state,
      error: { ...state.error, ...error },
    })
  ),
  on(
    ProductSelectionActions.setLoadcaseTemplate,
    (state, { loadcaseTemplate }): ProductSelectionState => ({
      ...state,
      loadcaseTemplate,
    })
  ),
  on(
    ProductSelectionActions.setOperatingConditionsTemplate,
    (state, { operatingConditionsTemplate }): ProductSelectionState => ({
      ...state,
      operatingConditionsTemplate,
    })
  ),
  on(
    ProductSelectionActions.setBearingProductClass,
    (state, { productClass }): ProductSelectionState => ({
      ...state,
      bearingProductClass: productClass,
    })
  )
);

export function reducer(
  state: ProductSelectionState,
  action: Action
): ProductSelectionState {
  return productSelectionReducer(state, action);
}
