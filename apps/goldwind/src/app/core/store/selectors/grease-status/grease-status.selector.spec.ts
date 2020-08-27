import { initialState } from '../../reducers/bearing/bearing.reducer';
import {
  getGreaseDisplay,
  getGreaseSensorId,
  getGreaseStatusLoading,
  getGreaseStatusResult,
} from './grease-status.selector';

describe('Grease Status Selector', () => {
  const fakeState = {
    greaseStatus: {
      ...initialState,
      result: {
        waterContentPercent: '69',
      },
      loading: false,
      display: {
        deteriorationPercent: true,
        temperatureCelsius: true,
        waterContentPercent: true,
        rotationalSpeed: true,
      },
    },
  };

  describe('getGreaseSensorId', () => {
    test('should return a static id, will change to actual one', () => {
      // adjust in future
      expect(getGreaseSensorId(fakeState)).toEqual(
        'ee7bffbe-2e87-49f0-b763-ba235dd7c876'
      );
    });
  });

  describe('getGreaseStatusLoading', () => {
    test('should return loading status', () => {
      expect(getGreaseStatusLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getGreaseStatusResult', () => {
    test('should return the grease status', () => {
      expect(getGreaseStatusResult(fakeState)).toEqual(
        fakeState.greaseStatus.result
      );
    });
  });

  describe('getGreaseDisplay', () => {
    test('should return the grease display options', () => {
      expect(getGreaseDisplay(fakeState)).toEqual(
        fakeState.greaseStatus.display
      );
    });
  });
});
