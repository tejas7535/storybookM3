import { initialState } from '../../reducers/data-view/data-view.reducer';
import {
  getDataInterval,
  getDataResult,
  getDeviceId,
  getFrequency,
} from './data-view.selector';

describe('EdmMonitor Selector', () => {
  const fakeState = {
    dataView: {
      ...initialState,
      loading: false,
      result: [
        {
          type: 'Load',
          description: 'Radial Load y',
          abreviation: 'F_y',
          actualValue: 1635.0,
          minValue: 1700.0,
          maxValue: 1900.0,
        },
      ],
      interval: {
        startDate: 123456789,
        endDate: 987654321,
      },
      frequency: 10,
    },
  };

  describe('getDeviceId', () => {
    test('should return a static id, will change to actual one', () => {
      // adjust in future
      expect(getDeviceId(fakeState)).toEqual('mark-has-to-tell-me');
    });
  });

  describe('getDataResult', () => {
    test('should return the Data View result', () => {
      expect(getDataResult(fakeState)).toEqual(fakeState.dataView.result);
    });
  });

  describe('getDataInterval', () => {
    test('should return a time interval with two timestamps', () => {
      expect(getDataInterval(fakeState)).toEqual(fakeState.dataView.interval);
    });
  });

  describe('getFrequency', () => {
    test('should the frequency number', () => {
      expect(getFrequency(fakeState)).toEqual(fakeState.dataView.frequency);
    });
  });
});
