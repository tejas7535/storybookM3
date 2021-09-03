import { initialState } from '../../reducers/edm-monitor/edm-monitor.reducer';
import { AntennaName, EdmStatus } from '../../reducers/edm-monitor/models';
import {
  getEdmInterval,
  getEdmLoading,
  getEdmResult,
} from './edm-monitor.selector';

describe('EdmMonitor Selector', () => {
  const fakeState = {
    edmMonitor: {
      ...initialState,
      loading: false,
      measurements: [
        {
          deviceId: 'B-Wing',
          timestamp: '2020-07-30T11:02:25',
          endTimestamp: '2020-07-30T11:02:25',
          startTimestamp: '2020-07-30T11:02:25',
          edm01Ai01Counter: 100,
          edm01Ai02Counter: 100,
        } as EdmStatus,
      ],
      interval: {
        startDate: 123_456_789,
        endDate: 987_654_321,
      },
    },
  };

  describe('getEdmResult', () => {
    it('should return EDM measurements', () => {
      expect(getEdmResult(fakeState)).toEqual(
        fakeState.edmMonitor.measurements
      );
    });
  });
  describe('getEdmLoading', () => {
    it('should return getEdmLoading', () => {
      expect(getEdmLoading(fakeState)).toEqual(fakeState.edmMonitor.loading);
    });
  });

  describe('getEdmInterval', () => {
    it('should return a time interval with two timestamps', () => {
      expect(getEdmInterval(fakeState)).toEqual(fakeState.edmMonitor.interval);
    });
  });
});
