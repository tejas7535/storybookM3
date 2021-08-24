import { Action } from '@ngrx/store';

import {
  bearingSearchSuccess,
  searchBearing,
  selectBearing,
} from '../../actions/bearing/bearing.actions';
import { bearingReducer, initialState, reducer } from './bearing.reducer';

describe('Bearing Reducer', () => {
  describe('Reducer function', () => {
    it('should return bearingReducer', () => {
      // prepare any action
      const action: Action = searchBearing({ query: 'mockQuery' });
      expect(reducer(initialState, action)).toEqual(
        bearingReducer(initialState, action)
      );
    });
  });

  describe('on searchBearing', () => {
    it('should set query and loading', () => {
      const action: Action = searchBearing({ query: 'mockQuery' });
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.search.query).toEqual('mockQuery');
    });
  });

  describe('on bearingSearchSuccess', () => {
    it('should set resultList and loading', () => {
      const mockResultList = ['bearing 1', 'bearing 2'];
      const action: Action = bearingSearchSuccess({
        resultList: mockResultList,
      });
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.search.resultList).toEqual(mockResultList);
    });
  });

  describe('on selectBearing', () => {
    it('should set selectedBearing', () => {
      const action: Action = selectBearing({ bearing: 'selected bearing' });
      const state = bearingReducer(initialState, action);

      expect(state.selectedBearing).toEqual('selected bearing');
    });
  });
});
