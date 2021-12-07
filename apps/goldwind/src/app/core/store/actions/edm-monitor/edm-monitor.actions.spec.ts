import { EdmStatus } from '../../reducers/edm-monitor/models';
import {
  getEdm,
  getEdmFailure,
  getEdmId,
  getEdmSuccess,
  setEdmInterval,
} from '..';

describe('EdmMonitor Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = 'my-device-test-id';
  });

  describe('Get EDM Monitor Actions', () => {
    it('getEdmId', () => {
      const action = getEdmId();

      expect(action).toEqual({
        type: '[EDM Monitor] Load EDM Sensor ID',
      });
    });

    it('getEdm', () => {
      const action = getEdm({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[EDM Monitor] Load EDM',
      });
    });

    it('getEdmSuccess', () => {
      const measurements: EdmStatus[] = [
        {
          deviceId: 'starkillerbase',
          timestamp: '2020-07-30T11:02:25',
          startTimestamp: '2020-07-30T11:02:25',
          endTimestamp: '2020-07-30T11:02:25',
          edm01Ai01Counter: 100,
          edm01Ai02Counter: 100,
        },
      ];
      const action = getEdmSuccess({ measurements });

      expect(action).toEqual({
        measurements,
        type: '[EDM Monitor] Load EDM Success',
      });
    });

    it('getEdmFailure', () => {
      const action = getEdmFailure();

      expect(action).toEqual({
        type: '[EDM Monitor] Load EDM Failure',
      });
    });

    it('setEdmInterval', () => {
      const mockInterval = {
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };
      const action = setEdmInterval({ interval: mockInterval });

      expect(action).toEqual({
        interval: mockInterval,
        type: '[EDM Monitor] Set Interval',
      });
    });
  });
});
