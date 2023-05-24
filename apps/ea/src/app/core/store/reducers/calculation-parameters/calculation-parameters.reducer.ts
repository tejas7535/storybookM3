import {
  CalculationParametersCalculationTypes,
  CalculationParametersState,
} from '@ea/core/store/models';
import { Action, createReducer, on } from '@ngrx/store';

import { CalculationTypesActions } from '../../actions';
import {
  operatingParameters,
  resetCalculationParameters,
  setIsInputInvalid,
} from '../../actions/calculation-parameters/calculation-parameters.actions';
import { setCalculationTypes } from '../../actions/calculation-parameters/calculation-types.actions';

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
  calculationTypes: {
    emission: {
      selected: true,
      visible: true,
      disabled: false,
    },
    friction: {
      selected: false,
      visible: true,
      disabled: false,
    },
  },
  isInputInvalid: true,
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
      isInputInvalid: false,
    })
  ),

  on(
    setIsInputInvalid,
    (state, { isInputInvalid }): CalculationParametersState => ({
      ...state,
      isInputInvalid,
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
  ),

  on(
    setCalculationTypes,
    (state, { calculationTypes }): CalculationParametersState => ({
      ...state,
      calculationTypes,
    })
  ),

  on(
    CalculationTypesActions.selectAll,
    (state, { selectAll }): CalculationParametersState => {
      const calculationTypes = {} as CalculationParametersCalculationTypes;

      for (const [name, item] of Object.entries(state.calculationTypes)) {
        calculationTypes[name as keyof CalculationParametersCalculationTypes] =
          {
            ...item,
            selected: item.disabled ? item.selected : selectAll,
          };
      }

      return {
        ...state,
        calculationTypes,
      };
    }
  ),

  on(
    CalculationTypesActions.selectType,
    (state, { calculationType, select }): CalculationParametersState => ({
      ...state,
      calculationTypes: {
        ...state.calculationTypes,
        [calculationType]: {
          ...state.calculationTypes[calculationType],
          selected: state.calculationTypes[calculationType].disabled
            ? state.calculationTypes[calculationType].selected
            : select,
        },
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
