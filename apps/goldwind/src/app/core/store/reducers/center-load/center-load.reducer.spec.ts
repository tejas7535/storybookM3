import { CenterLoadStatus } from '../../../../shared/models';
import {
  getCenterLoad,
  getCenterLoadFailure,
  getCenterLoadSuccess,
} from '../../actions';
import { centerLoadReducer, initialState } from './center-load.reducer';

describe('CenterLoad Reducer', () => {
  describe('getCenterLoad', () => {
    it('should set getCenterLoad', () => {
      const action = getCenterLoad({ deviceId: '123' });
      const state = centerLoadReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
    it('should set getCenterLoadSuccess', () => {
      const action = getCenterLoadSuccess({
        centerLoad: [{ deviceId: 'foo' } as CenterLoadStatus],
      });
      const state = centerLoadReducer(initialState, action);

      expect(state.result).toStrictEqual([{ deviceId: 'foo' }]);
    });
    it('should set getCenterLoadFailure', () => {
      const action = getCenterLoadFailure();
      const state = centerLoadReducer(initialState, action);

      expect(state.loading).toBeFalsy();
    });
  });
});
