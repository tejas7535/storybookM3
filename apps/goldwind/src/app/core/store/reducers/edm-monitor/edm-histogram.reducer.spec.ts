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
        channel: 'edm-1',
      });
      const state = edmHistogramReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getEdmSuccess', () => {
    it('should unset loading and set measurements', () => {
      const histogram: EdmHistogram[] = [
        {
          deviceId: 'ipsum',
          clazz2: 4480,
          clazz1: 4774,
          clazz0: 5204,
          clazz3: 820,
          channel: 'in occaecat tempor ullamco',
          timestamp: '2021-09-28T12:00:34.603Z',
          clazz4: 6287,
        },
      ];
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
