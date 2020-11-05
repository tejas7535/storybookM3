import { initialState } from '../../reducers/load-sense/load-sense.reducer';
import {
  getLiveStatus,
  getLoadInterval,
  getLoadSenseLoading,
  getLoadSenseResult,
} from './load-sense.selector';

describe('ConditionMonitoring Selector', () => {
  const fakeState = {
    loadSense: {
      ...initialState,
      loading: false,
      result: [
        {
          deviceId: 'string',
          id: 'string',
          lsp01Strain: 0,
          lsp02Strain: 0,
          lsp03Strain: 0,
          lsp04Strain: 0,
          lsp05Strain: 0,
          lsp06Strain: 0,
          lsp07Strain: 0,
          lsp08Strain: 0,
          lsp09Strain: 0,
          lsp10Strain: 0,
          lsp11Strain: 0,
          lsp12Strain: 0,
          lsp13Strain: 0,
          lsp14Strain: 0,
          lsp15Strain: 0,
          lsp16Strain: 0,
          timestamp: '2020-11-04T09:39:19.499Z',
        },
      ],
      interval: {
        startDate: 123456789,
        endDate: 987654321,
      },
    },
  };

  describe('getLiveStatus ', () => {
    test('should return numeric socket status', () => {
      expect(getLiveStatus(fakeState)).toEqual(false);
    });
  });

  describe('getLoadSenseLoading', () => {
    test('should return loading status', () => {
      expect(getLoadSenseLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getLoadSenseResult', () => {
    test('should return the load sense result', () => {
      expect(getLoadSenseResult(fakeState)).toEqual(fakeState.loadSense.result);
    });
  });

  describe('getLoadInterval', () => {
    test('should return a time interval with two timestamps', () => {
      expect(getLoadInterval(fakeState)).toEqual(fakeState.loadSense.interval);
    });
  });
});
