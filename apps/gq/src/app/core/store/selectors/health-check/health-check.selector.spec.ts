import { HEALTH_CHECK_STATE_MOCK } from '../../../../../testing/mocks/state';
import * as healthCheckSelector from './health-check.selector';

describe('Health Check Selector', () => {
  describe('getHealthCheckLoading', () => {
    test('should return healthCheckLoading', () => {
      expect(
        healthCheckSelector.getHealthCheckLoading.projector(
          HEALTH_CHECK_STATE_MOCK
        )
      ).toEqual(HEALTH_CHECK_STATE_MOCK.healthCheck.healthCheckLoading);
    });
  });
  describe('getHealthCheckAvailable', () => {
    test('should return healthCheckAvailable', () => {
      expect(
        healthCheckSelector.getHealthCheckAvailable.projector(
          HEALTH_CHECK_STATE_MOCK
        )
      ).toEqual(HEALTH_CHECK_STATE_MOCK.healthCheck.healthCheckAvailable);
    });
  });
});
