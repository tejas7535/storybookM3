import { Action, createReducer, on } from '@ngrx/store';

import {
  EnvironmentImpact,
  Movement,
  Property,
} from '../../../../shared/models';
import * as ParametersActions from '../../actions/parameters/parameters.actions';
import { RecursivePartial } from './../../../../shared/types/rescursive-partial.type';

export interface FullParameterState {
  loads: {
    radial: number;
    axial: number;
    exact: boolean;
    loadRatio: number;
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
  greaseEnabled: boolean;
  grease: {
    greaseList: string[];
    selectedGrease: string;
    maxTemperature: number;
    viscosity: number;
    nlgiClass: number;
  };
  valid: boolean;
  updating: boolean;
  properties: Property[];
}

export type ParameterState =
  | FullParameterState
  | RecursivePartial<FullParameterState>;

export const initialState: ParameterState = {
  loads: {
    radial: undefined,
    axial: undefined,
    exact: true,
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
  greaseEnabled: false,
  grease: {
    greaseList: [],
    selectedGrease: undefined,
    maxTemperature: undefined,
    viscosity: undefined,
    nlgiClass: undefined,
  },
  valid: false,
  updating: false,
  properties: undefined,
};

export const parameterReducer = createReducer(
  initialState,
  on(
    ParametersActions.patchParameters,
    (state, { parameters }): ParameterState => ({
      ...state,
      ...parameters,
      updating: true,
    })
  ),
  on(
    ParametersActions.modelUpdateSuccess,
    (state): ParameterState => ({
      ...state,
      updating: false,
    })
  ),
  on(
    ParametersActions.getPropertiesSuccess,
    (state, { properties }): ParameterState => ({
      ...state,
      properties,
    })
  )
);

export function reducer(state: ParameterState, action: Action): ParameterState {
  return parameterReducer(state, action);
}
