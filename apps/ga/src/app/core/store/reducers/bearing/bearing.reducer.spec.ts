import { Action } from '@ngrx/store';

import { BearingSelectionType } from '@ga/shared/models';
import { MODEL_MOCK_ID } from '@ga/testing/mocks';

import {
  advancedBearingSelectionCountSuccess,
  advancedBearingSelectionFailure,
  advancedBearingSelectionSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  searchBearingForAdvancedSelection,
  selectBearing,
  setBearingSelectionType,
} from '../../actions/bearing/bearing.actions';
import { initialState as BearingState } from '../../reducers/bearing/bearing.reducer';
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

  describe('on setBearingSelectionType', () => {
    it('should set selection type', () => {
      const action: Action = setBearingSelectionType({
        bearingSelectionType: BearingSelectionType.QuickSelection,
      });
      const state = bearingReducer(initialState, action);

      expect(state.bearingSelectionType).toEqual('QUICK_SELECTION');
    });
  });

  describe('on searchBearing', () => {
    it('should set query and loading', () => {
      const action: Action = searchBearing({ query: 'mockQuery' });
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.quickBearingSelection.query).toEqual('mockQuery');
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
      expect(state.quickBearingSelection.resultList).toEqual(mockResultList);
    });
  });

  describe('on searchBearingForAdvancedSelection', () => {
    const mockParameters = {
      ...BearingState.advancedBearingSelection.filters,
      pattern: 'testquery',
    };
    it('should set query and loading', () => {
      const action: Action = searchBearingForAdvancedSelection({
        selectionFilters: mockParameters,
      });
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.advancedBearingSelection.filters).toBe(mockParameters);
    });
  });

  describe('on advancedBearingSelectionSuccess', () => {
    it('should set advanced selection resultList and loading', () => {
      const mockResultList = ['bearing 1', 'bearing 2'];
      const action: Action = advancedBearingSelectionSuccess({
        resultList: mockResultList,
      });
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.advancedBearingSelection.resultList).toEqual(mockResultList);
    });
  });

  describe('on advancedBearingSelectionCountSuccess', () => {
    it('should set advanced selection result count and loading', () => {
      const mockResultsCount = 2;
      const action: Action = advancedBearingSelectionCountSuccess({
        resultsCount: 2,
      });
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.advancedBearingSelection.resultsCount).toEqual(
        mockResultsCount
      );
    });
  });

  describe('on advancedBearingSelectionFailure', () => {
    it('should set resultList to []', () => {
      const action: Action = advancedBearingSelectionFailure();
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.advancedBearingSelection.resultList).toEqual([]);
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
