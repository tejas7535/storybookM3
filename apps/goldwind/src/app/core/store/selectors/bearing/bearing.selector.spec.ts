import { initialState } from '../../reducers/bearing/bearing.reducer';
import { getBearingLoading, getBearingResult } from './bearing.selector';

describe('Bearing Selector', () => {
  const fakeState = {
    bearing: {
      ...initialState,
      bearing: {
        name: 'Thingname',
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
});
