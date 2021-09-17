import {
  bearingSearchSuccess,
  searchBearing,
  selectBearing,
  updateRouteParams,
} from '..';

describe('Bearing Actions', () => {
  describe('Search Bearing', () => {
    it('searchBearing', () => {
      const query = 'searchQuery';
      const action = searchBearing({ query });

      expect(action).toEqual({
        query,
        type: '[Bearing] Search Bearing',
      });
    });
  });

  describe('Search Bearing Success', () => {
    it('bearingSearchSuccess', () => {
      const resultList = ['bearing 1', 'bearing 2'];
      const action = bearingSearchSuccess({ resultList });

      expect(action).toEqual({
        resultList,
        type: '[Bearing] Search Bearing Success',
      });
    });
  });

  describe('Select Bearing', () => {
    it('selectBearing', () => {
      const bearing = 'bearingName';
      const action = selectBearing({ bearing });

      expect(action).toEqual({
        bearing,
        type: '[Bearing] Select Bearing',
      });
    });
  });

  describe('Update Route Params', () => {
    it('updateRouteParams', () => {
      const action = updateRouteParams();

      expect(action).toEqual({
        type: '[Bearing] Update Route Params',
      });
    });
  });
});
