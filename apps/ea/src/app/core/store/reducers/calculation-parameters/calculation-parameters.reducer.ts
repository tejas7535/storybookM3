import { CalculationParametersState } from '@ea/core/store/models';
import { Action, createReducer, on } from '@ngrx/store';

import {
  operatingParameters,
  resetCalculationParameters,
} from '../../actions/calculation-parameters/calculation-parameters.actions';

export const initialState: CalculationParametersState = {
  operationConditions: {
    rotationalSpeed: undefined,
    axialLoad: undefined,
    radialLoad: undefined,
    operatingTime: 8766,
    typeOfMovement: 'LB_ROTATING',
    oilTemp: 70,
    viscosity: 110, // Arcanol Multi 2
    movementFrequency: 0,
    oscillationAngle: 0,
  },
  energySource: {
    type: 'LB_ELECTRIC_ENERGY',
    electricityRegion: 'LB_EUROPEAN_UNION',
  },
  bearingDesignation: '6210-C-2HRS',
};

export const calculationParametersReducer = createReducer(
  initialState,
  on(
    operatingParameters,
    (state, { operationConditions }): CalculationParametersState => ({
      ...state,
      operationConditions: {
        ...state.operationConditions,
        ...operationConditions,
      },
    })
  ),

  on(
    resetCalculationParameters,
    (state): CalculationParametersState => ({
      ...state,
      operationConditions: {
        ...state.operationConditions,
        rotationalSpeed: undefined,
        axialLoad: undefined,
        radialLoad: undefined,
      },
    })
  )
);

export function reducer(
  state: CalculationParametersState,
  action: Action
): CalculationParametersState {
  return calculationParametersReducer(state, action);
}
