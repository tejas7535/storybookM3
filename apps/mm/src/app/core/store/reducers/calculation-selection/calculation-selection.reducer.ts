import { createReducer, on } from '@ngrx/store';

import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { CalculationSelectionState } from '../../models/calculation-selection-state.model';

export const initialState: CalculationSelectionState = {
  bearingResultList: undefined,
  stepper: {
    currentStep: 0,
  },
  bearing: undefined,
  bearingSeats: undefined,
};

export const calculationSelectionReducer = createReducer(
  initialState,
  on(
    CalculationSelectionActions.resetBearing,
    (): CalculationSelectionState => ({
      ...initialState,
    })
  ),
  on(
    CalculationSelectionActions.searchBearingList,
    (): CalculationSelectionState => ({
      ...initialState,
      loading: true,
    })
  ),
  on(
    CalculationSelectionActions.searchBearingSuccess,
    (state, { resultList }): CalculationSelectionState => ({
      ...state,
      bearingResultList: resultList,
      loading: false,
    })
  ),
  on(
    CalculationSelectionActions.setBearing,
    (state, { bearingId, title }): CalculationSelectionState => ({
      ...state,
      bearing: {
        bearingId,
        title,
      },
    })
  ),
  on(
    CalculationSelectionActions.setCurrentStep,
    (state, { step }): CalculationSelectionState => ({
      ...state,
      stepper: {
        ...state.stepper,
        currentStep: step,
      },
    })
  ),
  on(
    CalculationSelectionActions.setBearingSeats,
    (state, { bearingSeats }): CalculationSelectionState => ({
      ...state,
      bearingSeats: {
        values: bearingSeats,
      },
    })
  ),
  on(
    CalculationSelectionActions.setBearingSeat,
    (state, { bearingSeatId }): CalculationSelectionState => ({
      ...state,
      bearingSeats: {
        ...state?.bearingSeats,
        selectedValueId: bearingSeatId,
      },
      measurementMethods: undefined,
      mountingMethods: undefined,
    })
  ),
  on(
    CalculationSelectionActions.fetchMeasurementMethods,
    (state): CalculationSelectionState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    CalculationSelectionActions.setMeasurementMethods,
    (state, { measurementMethods }): CalculationSelectionState => ({
      ...state,
      measurementMethods: {
        values: measurementMethods,
      },
      loading: false,
    })
  ),
  on(
    CalculationSelectionActions.setMeasurementMethod,
    (state, { measurementMethod }): CalculationSelectionState => ({
      ...state,
      measurementMethods: {
        ...state?.measurementMethods,
        selectedValueId: measurementMethod,
      },
    })
  ),
  on(
    CalculationSelectionActions.fetchMountingMethods,
    (state): CalculationSelectionState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    CalculationSelectionActions.setMountingMethods,
    (state, { mountingMethods }): CalculationSelectionState => ({
      ...state,
      mountingMethods: {
        values: mountingMethods,
      },
      loading: false,
    })
  ),
  on(
    CalculationSelectionActions.setMountingMethod,
    (state, { mountingMethod }): CalculationSelectionState => ({
      ...state,
      mountingMethods: {
        ...state?.mountingMethods,
        selectedValueId: mountingMethod,
      },
    })
  )
);
