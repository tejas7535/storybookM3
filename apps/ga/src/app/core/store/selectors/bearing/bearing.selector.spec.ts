import {
  BearingState,
  initialState,
} from '../../reducers/bearing/bearing.reducer';
import {
  getBearingLoading,
  getBearingResultList,
  getSelectedBearing,
} from './bearing.selector';

describe('Bearing Selector', () => {
  const mockState: { bearing: BearingState } = {
    bearing: {
      ...initialState,
      search: {
        ...initialState.search,
        resultList: ['greatBearing', 'evenGreaterBearing'],
      },
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
  describe('getBearingResultList', () => {
    it('should return the result list', () => {
      expect(getBearingResultList(mockState)).toEqual([
        {
          id: 'greatBearing',
          title: 'greatBearing',
        },
        {
          id: 'evenGreaterBearing',
          title: 'evenGreaterBearing',
        },
      ]);
    });
  });
});
