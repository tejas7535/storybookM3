import {
  CalculationParametersCalculationTypes,
  CalculationParametersState,
} from '@ea/core/store/models';
import { Action, createReducer, on } from '@ngrx/store';

import {
  CalculationParametersActions,
  CalculationTypesActions,
} from '../../actions';
import {
  operatingParameters,
  resetCalculationParameters,
  setIsInputInvalid,
} from '../../actions/calculation-parameters/calculation-parameters.actions';
import { setCalculationTypes } from '../../actions/calculation-parameters/calculation-types.actions';

export const initialState: CalculationParametersState = {
  operationConditions: {
    loadCaseData: [
      {
        load: {
          axialLoad: undefined,
          radialLoad: undefined,
        },
        rotation: {
          rotationalSpeed: undefined,
          typeOfMotion: 'LB_ROTATING',
          shiftAngle: undefined,
          shiftFrequency: undefined,
        },
        operatingTemperature: 70,
        operatingTime: undefined,
        loadCaseName: '',
      },
    ],

    lubrication: {
      lubricationSelection: 'grease',
      grease: {
        selection: 'typeOfGrease',
        isoVgClass: { isoVgClass: undefined },
        typeOfGrease: { typeOfGrease: 'LB_FAG_MULTI_2' },
        viscosity: { ny100: undefined, ny40: undefined },
        environmentalInfluence: 'LB_AVERAGE_AMBIENT_INFLUENCE',
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
        oilFlow: undefined,
        oilTemperatureDifference: 0,
        externalHeatFlow: 0,
      },
    },
    ambientTemperature: 20,
    contamination: 'LB_STANDARD_CLEANLINESS',
    conditionOfRotation: 'innerring',
    selectedLoadcase: 0,
  },

  calculationTypes: {
    ratingLife: {
      selected: true,
      visible: true,
      disabled: false,
    },
    lubrication: {
      selected: false,
      visible: true,
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
  ),

  on(
    CalculationParametersActions.setSelectedLoadcase,
    (state, { selectedLoadcase }): CalculationParametersState => ({
      ...state,
      operationConditions: {
        ...state.operationConditions,
        selectedLoadcase,
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
