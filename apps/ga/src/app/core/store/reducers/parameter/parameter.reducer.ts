import { Action, createReducer } from '@ngrx/store';

import { Movement } from '../../../../shared/models';

export interface ParameterState {
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
}

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
};

export const parameterReducer = createReducer(initialState);

export function reducer(state: ParameterState, action: Action): ParameterState {
  return parameterReducer(state, action);
}
