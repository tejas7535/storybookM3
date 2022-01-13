import { Action } from '@ngrx/store';

import * as A from '../../actions/edm-monitor/edm-histogram.actions';
import {
  EdmHistogram,
  edmHistogramReducer,
  initialState,
  reducer,
} from './edm-histogram.reducer';

describe('EDM Histogram Reducer', () => {
  describe('getEdm', () => {
    it('should set loading', () => {
      const action = A.getEdmHistogram({
        deviceId: 'fantasyId',
      });
      const state = edmHistogramReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getEdmSuccess', () => {
    it('should unset loading and set measurements', () => {
      const histogram: EdmHistogram = { edm1: [], edm2: [] };

      const action = A.getEdmHistogramSuccess({ histogram });

      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = edmHistogramReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.result).toEqual(histogram);
    });
  });

  describe('getEdmFailure', () => {
    it('should unset loading', () => {
      const action = A.getEdmHistogramFailure();
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = edmHistogramReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('Reducer function', () => {
    it('should return edmHistogramReducer', () => {
      // prepare any action
      const action: Action = A.getEdmHistogramFailure();
      expect(reducer(initialState, action)).toEqual(
        edmHistogramReducer(initialState, action)
      );
    });
  });
});
