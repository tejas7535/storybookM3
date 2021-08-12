import * as A from '../../actions/grease-status/grease-status.actions';
import {
  greaseHeatmapStatusReducer,
  initialState,
  reducer,
} from './heatmap.reducer';

describe('greaseHeatmapStatusReducer', () => {
  describe('getGreaseHeatMap', () => {
    it('should set loading', () => {
      const action = A.getGreaseHeatMap({ deviceId: 'starkiller-windmill' });
      const state = greaseHeatmapStatusReducer(initialState, action);
      expect(state.loading).toBeTruthy();
    });
  });

  describe('getGreaseHeatMapLatest', () => {
    it('should return result', () => {
      const action = A.getGreaseHeatMapLatest({ deviceId: 'deathstar-mill' });
      const state = greaseHeatmapStatusReducer(
        {
          ...initialState,
          result: [{ deviceId: 'deathstar-mill' } as any],
        },
        action
      );
      expect(state.result).toStrictEqual([{ deviceId: 'deathstar-mill' }]);
    });
  });

  describe('getGreaseHeatMapSuccess', () => {
    it('should the result accourding to the passed action prop', () => {
      const action = A.getGreaseHeatMapSuccess({
        gcmheatmap: [{ deviceId: 'x-wing-mill' }] as any,
      });
      const state = greaseHeatmapStatusReducer(initialState, action);
      expect(state.result).toStrictEqual([{ deviceId: 'x-wing-mill' }]);
    });
  });

  describe('getGreaseHeatMapFailure', () => {
    it('should set loading to false', () => {
      const action = A.getGreaseHeatMapFailure();
      const state = greaseHeatmapStatusReducer(initialState, action);
      expect(state.loading).toBeFalsy();
    });
  });

  describe('Reducer function', () => {
    it('should return heatmapReducer', () => {
      const action = A.getGreaseHeatMapFailure();
      expect(reducer(initialState, action)).toEqual(
        greaseHeatmapStatusReducer(initialState, action)
      );
    });
  });
});
