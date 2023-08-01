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
    rotation: {
      rotationalSpeed: undefined,
      typeOfMovement: 'LB_ROTATING',
    },
    load: {
      axialLoad: undefined,
      radialLoad: undefined,
    },
    lubrication: {
      lubricationSelection: 'grease',
      grease: {
        selection: 'typeOfGrease',
        isoVgClass: { isoVgClass: undefined },
        typeOfGrease: { typeOfGrease: 'LB_FAG_MULTI_2' },
        viscosity: { ny100: undefined, ny40: undefined },
      },
      oilBath: {
        selection: 'isoVgClass',
        isoVgClass: { isoVgClass: undefined },
        viscosity: { ny100: undefined, ny40: undefined },
      },
      oilMist: {
        selection: 'isoVgClass',
        isoVgClass: { isoVgClass: undefined },
        viscosity: { ny100: undefined, ny40: undefined },
      },
      recirculatingOil: {
        selection: 'isoVgClass',
        isoVgClass: { isoVgClass: undefined },
        viscosity: { ny100: undefined, ny40: undefined },
      },
    },
    operatingTime: 8766,
    ambientTemperature: 20,
    operatingTemperature: 70,
    movementFrequency: 0,
    oscillationAngle: 0,
    contamination: 'LB_STANDARD_CLEANLINESS',
    energySource: {
      type: 'electric',
      electric: {
        electricityRegion: 'LB_EUROPEAN_UNION',
      },
    },
    conditionOfRotation: 'innerring',
    externalHeatFlow: 0,
  },

  calculationTypes: {
    ratingLife: {
      selected: false,
      visible: true,
      disabled: false,
    },
    lubrication: {
      selected: false,
      visible: false,
      disabled: false,
    },
    frictionalPowerloss: {
      selected: false,
      visible: true,
      disabled: false,
    },
    emission: {
      selected: true,
      visible: true,
      disabled: false,
    },
    overrollingFrequency: {
      selected: false,
      visible: false,
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
        ...initialState.operationConditions,
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
