import { createFeature, createReducer, on } from '@ngrx/store';

import { HealthCheckActions } from './health-check.actions';

const HEALTH_CHECK_KEY = 'healthCheck';

export interface HealthCheckState {
  healthCheckLoading: boolean;
  healthCheckAvailable: boolean;
  error: Error | undefined;
}

export const initialState: HealthCheckState = {
  healthCheckLoading: false,
  healthCheckAvailable: false,
  error: undefined,
};

export const healthCheckFeature = createFeature({
  name: HEALTH_CHECK_KEY,
  reducer: createReducer(
    initialState,
    on(
      HealthCheckActions.pingHealthCheck,
      (state: HealthCheckState): HealthCheckState => ({
        ...state,
        error: undefined,
        healthCheckLoading: true,
        healthCheckAvailable: false,
      })
    ),
    on(
      HealthCheckActions.pingHealthCheckSuccess,
      (state: HealthCheckState): HealthCheckState => ({
        ...state,
        healthCheckAvailable: true,
        healthCheckLoading: false,
        error: undefined,
      })
    ),
    on(
      HealthCheckActions.pingHealthCheckFailure,
      (state: HealthCheckState, { error }): HealthCheckState => ({
        ...state,
        error,
        healthCheckAvailable: false,
        healthCheckLoading: false,
      })
    )
  ),
});
