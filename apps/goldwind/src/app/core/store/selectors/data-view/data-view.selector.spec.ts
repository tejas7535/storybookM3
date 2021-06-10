import { initialState } from '../../reducers/data-view/data-view.reducer';
import {
  getDataInterval,
  getDataResult,
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

  describe('getDataResult', () => {
    it('should return the Data View result', () => {
      expect(getDataResult(fakeState)).toEqual(fakeState.dataView.result);
    });
  });

  describe('getDataInterval', () => {
    it('should return a time interval with two timestamps', () => {
      expect(getDataInterval(fakeState)).toEqual(fakeState.dataView.interval);
    });
  });

  describe('getFrequency', () => {
    it('should the frequency number', () => {
      expect(getFrequency(fakeState)).toEqual(fakeState.dataView.frequency);
    });
  });
});
