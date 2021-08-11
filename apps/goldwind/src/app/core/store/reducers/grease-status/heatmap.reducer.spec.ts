import * as A from '../../actions/grease-status/grease-status.actions';
import { greaseHeatmapStatusReducer, initialState } from './heatmap.reducer';

describe('greaseHeatmapStatusReducer', () => {
  describe('getGreaseHeatMap', () => {
    it('should set loading', () => {
      const action = A.getGreaseHeatMap({ deviceId: 'blub' });
      const state = greaseHeatmapStatusReducer(initialState, action);
      expect(state.loading).toBeTruthy();
    });
  });

  describe('getGreaseHeatMapLatest', () => {
    it('should return result', () => {
      const action = A.getGreaseHeatMapLatest({ deviceId: 'x' });
      const state = greaseHeatmapStatusReducer(
        {
          ...initialState,
          result: [{ deviceId: 'foo' } as any],
        },
        action
      );
      expect(state.result).toStrictEqual([{ deviceId: 'foo' }]);
    });
  });

  describe('getGreaseHeatMapSuccess', () => {
    it('testname', () => {
      const action = A.getGreaseHeatMapSuccess({
        gcmheatmap: [{ deviceId: 'foo' }] as any,
      });
      const state = greaseHeatmapStatusReducer(initialState, action);
      expect(state.result).toStrictEqual([{ deviceId: 'foo' }]);
    });
  });

  describe('getGreaseHeatMapFailure', () => {
    it('testname', () => {
      const action = A.getGreaseHeatMapFailure();
      const state = greaseHeatmapStatusReducer(initialState, action);
      expect(state.loading).toBeFalsy();
    });
  });
});

// on(A.getGreaseHeatMapFailure, U.getStateFailure())
