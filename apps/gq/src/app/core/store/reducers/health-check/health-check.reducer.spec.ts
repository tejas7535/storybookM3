import { HEALTH_CHECK_STATE_MOCK } from '../../../../../testing/mocks';
import {
  pingHealthCheck,
  pingHealthCheckFailure,
  pingHealthCheckSuccess,
} from '../../actions/health-check/health-check.actions';
import { healthCheckReducer } from './health-check.reducer';

describe('Health Check Reducer', () => {
  describe('pingHealthCheck', () => {
    test('should set healthCheckLoading', () => {
      const action = pingHealthCheck();

      const state = healthCheckReducer(HEALTH_CHECK_STATE_MOCK, action);

      expect(state).toEqual({
        ...HEALTH_CHECK_STATE_MOCK,
        healthCheck: {
          errorMessage: undefined,
          healthCheckAvailable: undefined,
          healthCheckLoading: true,
        },
      });
    });
  });
  describe('pingHealthCheckSuccess', () => {
    test('should set healthCheckAvailable', () => {
      const action = pingHealthCheckSuccess();

      const state = healthCheckReducer(HEALTH_CHECK_STATE_MOCK, action);

      expect(state).toEqual({
        ...HEALTH_CHECK_STATE_MOCK,
        healthCheck: {
          errorMessage: undefined,
          healthCheckAvailable: true,
          healthCheckLoading: false,
        },
      });
    });
  });
  describe('pingHealthCheckFailure', () => {
    test('should set errorMessage', () => {
      const errorMessage = 'error';
      const action = pingHealthCheckFailure({ errorMessage });

      const state = healthCheckReducer(HEALTH_CHECK_STATE_MOCK, action);

      expect(state).toEqual({
        ...HEALTH_CHECK_STATE_MOCK,
        healthCheck: {
          errorMessage,
          healthCheckAvailable: false,
          healthCheckLoading: false,
        },
      });
    });
  });
});
