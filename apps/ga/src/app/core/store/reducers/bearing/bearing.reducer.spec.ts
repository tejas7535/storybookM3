import { Action } from '@ngrx/store';

import { MODEL_MOCK_ID } from '../../../../../testing/mocks/rest.service.mock';
import {
  bearingSearchExtendedSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  searchBearingExtended,
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

  describe('on searchBearingExtended', () => {
    it('should set query and loading', () => {
      const action: Action = searchBearingExtended();
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBe(true);
    });
  });

  describe('on bearingSearchExtendedSuccess', () => {
    it('should set extended search resultList and loading', () => {
      const mockResultList = ['extended bearing 1', 'extended bearing 2'];
      const action: Action = bearingSearchExtendedSuccess({
        resultList: mockResultList,
      });
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.extendedSearch.resultList).toEqual(mockResultList);
    });
  });

  describe('on modelCreateSuccess', () => {
    it('should set selectedBearing', () => {
      const action: Action = modelCreateSuccess({ modelId: MODEL_MOCK_ID });
      const state = bearingReducer(initialState, action);

      expect(state.modelId).toEqual(MODEL_MOCK_ID);
    });
  });

  describe('on modelCreationFailure', () => {
    it('should set modelCreationSuccess', () => {
      const action: Action = modelCreateFailure();
      const state = bearingReducer(initialState, action);

      expect(state.modelCreationSuccess).toEqual(false);
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
