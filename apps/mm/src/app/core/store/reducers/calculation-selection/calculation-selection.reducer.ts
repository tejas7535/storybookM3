import { createReducer, on } from '@ngrx/store';

import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { CalculationSelectionState } from '../../models/calculation-selection-state.model';

export const initialState: CalculationSelectionState = {
  bearingResultList: undefined,
  stepper: {
    currentStep: undefined,
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
    CalculationSelectionActions.setBearingType,
    (state, { typeId, title }): CalculationSelectionState => ({
      ...state,
      bearing: {
        ...state.bearing,
        type: {
          typeId,
          title,
        },
      },
    })
  ),
  on(
    CalculationSelectionActions.setBearingSeries,
    (state, { seriesId, title }): CalculationSelectionState => ({
      ...state,
      bearing: {
        ...state.bearing,
        series: {
          seriesId,
          title,
        },
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
    })
  ),
  on(
    CalculationSelectionActions.setMeasurementMethods,
    (state, { measurementMethods }): CalculationSelectionState => ({
      ...state,
      measurementMethods: {
        values: measurementMethods,
      },
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
    CalculationSelectionActions.setMountingMethods,
    (state, { mountingMethods }): CalculationSelectionState => ({
      ...state,
      mountingMethods: {
        values: mountingMethods,
      },
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
