import { HealthCheckState } from '../../../app/core/store/reducers/health-check/health-check.reducer';

export const HEALTH_CHECK_STATE_MOCK: HealthCheckState = {
  healthCheck: {
    errorMessage: undefined,
    healthCheckAvailable: true,
    healthCheckLoading: false,
  },
};
