import { initialState } from '../../reducers/bearing/bearing.reducer';
import {
  getBearingLoading,
  getBearingResult,
  getMainBearing,
} from './bearing.selector';

describe('Bearing Selector', () => {
  const fakeState = {
    bearing: {
      ...initialState,
      result: {
        title: 'BearingTitle',
        mainBearing: {
          model: 'BearingModel',
        },
      },
      loading: false,
    },
  };

  describe('getBearingLoading', () => {
    test('should return loading status', () => {
      expect(getBearingLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getBearingResult', () => {
    test('should return a bearing', () => {
      expect(getBearingResult(fakeState)).toEqual(fakeState.bearing.result);
    });
  });

  describe('getMainBearing', () => {
    test('should return the main bearing', () => {
      expect(getMainBearing(fakeState)).toEqual(
        fakeState.bearing.result.mainBearing
      );
    });
  });
});
