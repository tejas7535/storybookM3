import { adaptPreferredGreaseOptionsFromDialogResponseListValues } from '@ga/core/helpers/grease-helpers';
import { Action, createReducer, on } from '@ngrx/store';

import {
  EnvironmentImpact,
  LoadLevels,
  Movement,
  PreferredGrease,
  Property,
} from '@ga/shared/models';

import * as parametersActions from '../../actions/parameters/parameters.actions';

export interface ParameterState {
  loads: {
    radial: number;
    axial: number;
    exact: boolean;
    loadRatio: LoadLevels;
  };
  movements: {
    type: Movement;
    rotationalSpeed: number;
    shiftFrequency: number;
    shiftAngle: number;
  };
  environment: {
    operatingTemperature: number;
    environmentTemperature: number;
    environmentImpact: EnvironmentImpact;
  };
  preferredGrease: PreferredGrease;
  valid: boolean;
  updating: boolean;
  properties: Property[];
}

export const initialState: ParameterState = {
  loads: {
    radial: undefined,
    axial: undefined,
    exact: false,
    loadRatio: undefined,
  },
  movements: {
    type: Movement.rotating,
    rotationalSpeed: undefined,
    shiftFrequency: undefined,
    shiftAngle: undefined,
  },
  environment: {
    operatingTemperature: 70,
    environmentTemperature: 20,
    environmentImpact: EnvironmentImpact.moderate,
  },
  preferredGrease: {
    greaseOptions: [],
    selectedGrease: undefined,
    maxTemperature: undefined,
    viscosity: undefined,
    nlgiClass: undefined,
    loading: false,
  },
  valid: false,
  updating: false,
  properties: undefined,
};

export const parameterReducer = createReducer(
  initialState,
  on(
    parametersActions.patchParameters,
    (state, { parameters }): ParameterState => ({
      ...state,
      ...parameters,
      updating: true,
    })
  ),
  on(
    parametersActions.modelUpdateSuccess,
    (state): ParameterState => ({
      ...state,
      updating: false,
    })
  ),
  on(
    parametersActions.getPropertiesSuccess,
    (state, { properties }): ParameterState => ({
      ...state,
      properties,
    })
  ),
  on(
    parametersActions.getDialog,
    (state): ParameterState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        loading: true,
      },
    })
  ),
  on(
    parametersActions.getDialogSuccess,
    (state, { dialogResponse }): ParameterState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        greaseOptions: adaptPreferredGreaseOptionsFromDialogResponseListValues(
          dialogResponse?.pages[2]?.groups[0]?.members[1]?.listValues
        ),
        loading: false,
      },
    })
  ),
  on(
    parametersActions.getDialogFailure,
    parametersActions.getDialogEnd,
    (state): ParameterState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        loading: false,
      },
    })
  ),
  on(
    parametersActions.setPreferredGreaseSelection,
    (state, { selectedGrease }): ParameterState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        selectedGrease,
      },
    })
  ),
  on(
    parametersActions.resetPreferredGreaseSelection,
    (state): ParameterState => ({
      ...state,
      preferredGrease: {
        ...state.preferredGrease,
        selectedGrease: undefined,
      },
    })
  )
);

export function reducer(state: ParameterState, action: Action): ParameterState {
  return parameterReducer(state, action);
}
