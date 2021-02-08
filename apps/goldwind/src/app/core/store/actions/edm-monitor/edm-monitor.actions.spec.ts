import {
  getEdm,
  getEdmFailure,
  getEdmId,
  getEdmSuccess,
  setEdmInterval,
} from '..';
import { Edm } from '../../reducers/edm-monitor/models';

describe('EdmMonitor Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = 'my-device-test-id';
  });

  describe('Get EDM Monitor Actions', () => {
    test('getEdmId', () => {
      const action = getEdmId();

      expect(action).toEqual({
        type: '[EDM Monitor] Load EDM Sensor ID',
      });
    });

    test('getEdm', () => {
      const action = getEdm({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[EDM Monitor] Load EDM',
      });
    });

    test('getEdmSuccess', () => {
      const measurements: Edm[] = [
        {
          startDate: '2020-07-30T11:02:25',
          edmValue1Counter: 100,
          edmValue2Counter: 200,
          edmValue1CounterMax: 300,
          edmValue2CounterMax: 400,
        },
      ];
      const action = getEdmSuccess({ measurements });

      expect(action).toEqual({
        measurements,
        type: '[EDM Monitor] Load EDM Success',
      });
    });

    test('getEdmFailure', () => {
      const action = getEdmFailure();

      expect(action).toEqual({
        type: '[EDM Monitor] Load EDM Failure',
      });
    });

    test('setEdmInterval', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };
      const action = setEdmInterval({ interval: mockInterval });

      expect(action).toEqual({
        interval: mockInterval,
        type: '[EDM Monitor] Set Interval',
      });
    });
  });
});
