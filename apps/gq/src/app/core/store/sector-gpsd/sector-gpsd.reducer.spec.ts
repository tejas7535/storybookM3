import { SectorGpsdActions } from './sector-gpsd.actions';
import { initialState, sectorGpsdFeature } from './sector-gpsd.reducer';

describe('sectorGpsdReducer', () => {
  describe('getAllSectorGpsds', () => {
    test('should set sectorGpsdLoading to true', () => {
      const action = SectorGpsdActions.getAllSectorGpsds({
        customerId: 'test',
        salesOrg: 'test',
      });
      const state = sectorGpsdFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        sectorGpsdLoading: true,
      });
    });
    test('should set sectorGpsdLoading to false and set sectorGpsds', () => {
      const sectorGpsds = [{ name: 'test', id: 'test' }];
      const action = SectorGpsdActions.getAllSectorGpsdsSuccess({
        sectorGpsds,
      });
      const state = sectorGpsdFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        sectorGpsds,
        sectorGpsdLoading: false,
        errorMessage: undefined,
      });
    });
    test('should set sectorGpsdLoading to false and set errorMessage', () => {
      const errorMessage = 'this is an error message';
      const action = SectorGpsdActions.getAllSectorGpsdsFailure({
        errorMessage,
      });
      const state = sectorGpsdFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        sectorGpsds: [],
        sectorGpsdLoading: false,
        errorMessage,
      });
    });
    test('should reset all sectorGpsds', () => {
      const action = SectorGpsdActions.resetAllSectorGpsds();
      const state = sectorGpsdFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
      });
    });
  });

  describe('extraSelectors', () => {
    test('should return selectedSectorGpsd', () => {
      expect(
        sectorGpsdFeature.getSelectedSectorGpsd.projector({
          name: 'test',
          id: 'test',
        })
      ).toEqual({ name: 'test', id: 'test' });
    });
  });
});
