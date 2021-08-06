import {
  BearingState,
  initialState,
} from '../../reducers/bearing/bearing.reducer';
import { getBearingLoading } from './bearing.selector';

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
});
