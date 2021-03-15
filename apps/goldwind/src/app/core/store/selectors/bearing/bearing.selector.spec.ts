import { initialState } from '../../reducers/bearing/bearing.reducer';
import { getBearingLoading, getBearingResult } from './bearing.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
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
});
