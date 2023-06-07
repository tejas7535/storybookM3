import { HealthCheckState } from '@gq/core/store/health-check/health-check.reducer';

export const HEALTH_CHECK_STATE_MOCK: HealthCheckState = {
  error: undefined,
  healthCheckAvailable: true,
  healthCheckLoading: false,
};
