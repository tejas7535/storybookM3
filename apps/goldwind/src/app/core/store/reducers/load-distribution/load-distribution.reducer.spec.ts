import { Action } from '@ngrx/store';

import {
  getLoadDistributionLatest,
  getLoadDistributionLatestFailure,
  getLoadDistributionLatestSuccess,
} from '../..';
import { LoadDistribution } from '../../selectors/load-distribution/load-distribution.interface';
import { LoadSense } from '../load-sense/models';
import {
  initialState,
  loadDistributionReducer,
  reducer,
} from './load-distribution.reducer';

describe('Load Distribution Reducer', () => {
  describe('getLoadDistributionLatest', () => {
    it('should set loading', () => {
      const action = getLoadDistributionLatest({ deviceId: '123' });
      const state = loadDistributionReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getLoadDistributionLatestSuccess', () => {
    it('should set loading', () => {
      const action = getLoadDistributionLatestSuccess({
        row1: {
          deviceId: 'ShushiRoll1',
        } as LoadDistribution,
        row2: {
          deviceId: 'ShushiRoll2',
        } as LoadDistribution,
        lsp: {
          deviceId: 'LSP-Pong1',
        } as LoadSense,
      });
      const state = loadDistributionReducer(initialState, action);

      expect(state.result.lsp).toBeDefined();
      expect(state.result.row1).toBeDefined();
      expect(state.result.row2).toBeDefined();
    });
  });

  describe('Reducer function', () => {
    it('should return loadSenseReducer', () => {
      // prepare any action
      const action: Action = getLoadDistributionLatestFailure();
      expect(reducer(initialState, action)).toEqual(
        loadDistributionReducer(initialState, action)
      );
    });
  });
});
