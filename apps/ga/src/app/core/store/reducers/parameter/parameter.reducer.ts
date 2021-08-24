import { Action, createReducer, on } from '@ngrx/store';

import { Movement } from '../../../../shared/models';
import * as ParametersActions from '../../actions/parameters/parameters.action';
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
    environmentImpact: string;
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
}

export type ParameterState =
  | FullParameterState
  | RecursivePartial<FullParameterState>;

export const initialState: ParameterState = {
  loads: {
    radial: 0,
    axial: 0,
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
    environmentImpact: undefined,
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
};

export const parameterReducer = createReducer(
  initialState,
  on(
    ParametersActions.patchParameters,
    (state, { parameters }): ParameterState => ({
      ...state,
      ...parameters,
    })
  )
);

export function reducer(state: ParameterState, action: Action): ParameterState {
  return parameterReducer(state, action);
}
