import { HEALTH_CHECK_STATE_MOCK } from '../../../../testing/mocks';
import { HealthCheckActions } from './health-check.actions';
import { healthCheckFeature } from './health-check.reducer';

describe('Health Check Reducer', () => {
  describe('pingHealthCheck', () => {
    test('should set healthCheckLoading', () => {
      const action = HealthCheckActions.pingHealthCheck();

      const state = healthCheckFeature.reducer(HEALTH_CHECK_STATE_MOCK, action);

      expect(state).toEqual({
        ...HEALTH_CHECK_STATE_MOCK,
        error: undefined,
        healthCheckAvailable: false,
        healthCheckLoading: true,
      });
    });
  });
  describe('pingHealthCheckSuccess', () => {
    test('should set healthCheckAvailable', () => {
      const action = HealthCheckActions.pingHealthCheckSuccess();

      const state = healthCheckFeature.reducer(HEALTH_CHECK_STATE_MOCK, action);

      expect(state).toEqual({
        ...HEALTH_CHECK_STATE_MOCK,
        error: undefined,
        healthCheckAvailable: true,
        healthCheckLoading: false,
      });
    });
  });
  describe('pingHealthCheckFailure', () => {
    test('should set errorMessage', () => {
      const error = new Error('error');
      const action = HealthCheckActions.pingHealthCheckFailure({
        error,
      });

      const state = healthCheckFeature.reducer(HEALTH_CHECK_STATE_MOCK, action);

      expect(state).toEqual({
        ...HEALTH_CHECK_STATE_MOCK,
        error,
        healthCheckAvailable: false,
        healthCheckLoading: false,
      });
    });
  });
});
