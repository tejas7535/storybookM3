import {
  BearingState,
  initialState,
} from '../../reducers/bearing/bearing.reducer';
import { getBearingLoading, getSelectedBearing } from './bearing.selector';

describe('Bearing Selector', () => {
  const mockState: { bearing: BearingState } = {
    bearing: {
      ...initialState,
    },
  };

  describe('getBearingLoading', () => {
    it('should return loading latest status', () => {
      expect(getBearingLoading(mockState)).toBeFalsy();
    });
  });

  describe('getSelectedBearing', () => {
    it('should return the selected bearing', () => {
      expect(
        getSelectedBearing.projector({
          ...initialState,
          selectedBearing: 'a selected bearing',
        })
      ).toEqual('a selected bearing');
    });
  });
});
