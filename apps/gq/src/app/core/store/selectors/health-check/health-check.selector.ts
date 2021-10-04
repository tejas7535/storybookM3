import { createSelector } from '@ngrx/store';

import { getHealthCheckState } from '../../reducers';
import { HealthCheckState } from '../../reducers/health-check/health-check.reducer';

export const getHealthCheckLoading = createSelector(
  getHealthCheckState,
  (state: HealthCheckState) => state.healthCheck.healthCheckLoading
);

export const getHealthCheckAvailable = createSelector(
  getHealthCheckState,
  (state: HealthCheckState) => state.healthCheck.healthCheckAvailable
);
