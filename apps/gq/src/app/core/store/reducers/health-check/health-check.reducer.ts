import { Action, createReducer, on } from '@ngrx/store';

import {
  pingHealthCheck,
  pingHealthCheckFailure,
  pingHealthCheckSuccess,
} from '../../actions/health-check/health-check.actions';

export interface HealthCheckState {
  healthCheck: {
    healthCheckLoading: boolean;
    healthCheckAvailable: boolean;
    errorMessage: string;
  };
}

export const initialState: HealthCheckState = {
  healthCheck: {
    healthCheckAvailable: undefined,
    healthCheckLoading: undefined,
    errorMessage: undefined,
  },
};

export const healthCheckReducer = createReducer(
  initialState,
  on(
    pingHealthCheck,
    (state: HealthCheckState): HealthCheckState => ({
      ...state,
      healthCheck: {
        ...state.healthCheck,
        errorMessage: undefined,
        healthCheckLoading: true,
        healthCheckAvailable: undefined,
      },
    })
  ),
  on(
    pingHealthCheckSuccess,
    (state: HealthCheckState): HealthCheckState => ({
      ...state,
      healthCheck: {
        healthCheckAvailable: true,
        healthCheckLoading: false,
        errorMessage: undefined,
      },
    })
  ),
  on(
    pingHealthCheckFailure,
    (state: HealthCheckState, { errorMessage }): HealthCheckState => ({
      ...state,
      healthCheck: {
        ...state.healthCheck,
        errorMessage,
        healthCheckAvailable: false,
        healthCheckLoading: false,
      },
    })
  )
);
export function reducer(
  state: HealthCheckState,
  action: Action
): HealthCheckState {
  return healthCheckReducer(state, action);
}
