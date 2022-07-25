import { Action } from '@ngrx/store';

import {
  advancedBearingSelectionCountSuccess,
  advancedBearingSelectionFailure,
  advancedBearingSelectionSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  resetBearing,
  searchBearing,
  searchBearingForAdvancedSelection,
  selectBearing,
  setBearingSelectionType,
} from '@ga/core/store/actions';
import { BearingSelectionType } from '@ga/shared/models';
import { MODEL_MOCK_ID } from '@ga/testing/mocks';

import { initialState as initialBearingSelectionState } from './bearing-selection.reducer';
import {
  bearingSelectionReducer,
  initialState,
  reducer,
} from './bearing-selection.reducer';

describe('bearingSelectionReducer', () => {
  describe('Reducer function', () => {
    it('should return bearingSelectionReducer', () => {
      // prepare any action
      const action: Action = searchBearing({ query: 'mockQuery' });
      expect(reducer(initialState, action)).toEqual(
        bearingSelectionReducer(initialState, action)
      );
    });
  });

  describe('on setBearingSelectionType', () => {
    it('should set selection type', () => {
      const action: Action = setBearingSelectionType({
        bearingSelectionType: BearingSelectionType.QuickSelection,
      });
      const state = bearingSelectionReducer(initialState, action);

      expect(state.bearingSelectionType).toEqual('QUICK_SELECTION');
    });
  });

  describe('on searchBearing', () => {
    it('should set query and loading', () => {
      const action: Action = searchBearing({ query: 'mockQuery' });
      const state = bearingSelectionReducer(initialState, action);

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
      const state = bearingSelectionReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.quickBearingSelection.resultList).toEqual(mockResultList);
    });
  });

  describe('on searchBearingForAdvancedSelection', () => {
    const mockParameters = {
      ...initialBearingSelectionState.advancedBearingSelection.filters,
      pattern: 'testquery',
    };
    it('should set query and loading', () => {
      const action: Action = searchBearingForAdvancedSelection({
        selectionFilters: mockParameters,
      });
      const state = bearingSelectionReducer(initialState, action);

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
      const state = bearingSelectionReducer(initialState, action);

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
      const state = bearingSelectionReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.advancedBearingSelection.resultsCount).toEqual(
        mockResultsCount
      );
    });
  });

  describe('on advancedBearingSelectionFailure', () => {
    it('should set resultList to []', () => {
      const action: Action = advancedBearingSelectionFailure();
      const state = bearingSelectionReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.advancedBearingSelection.resultList).toEqual([]);
    });
  });

  describe('on selectBearing', () => {
    it('should set selectedBearing', () => {
      const action: Action = selectBearing({ bearing: 'selected bearing' });
      const state = bearingSelectionReducer(initialState, action);

      expect(state.selectedBearing).toEqual('selected bearing');
      expect(state.modelCreationLoading).toBe(true);
    });
  });

  describe('on modelCreateSuccess', () => {
    it('should set selectedBearing', () => {
      const action: Action = modelCreateSuccess({ modelId: MODEL_MOCK_ID });
      const state = bearingSelectionReducer(initialState, action);

      expect(state.modelId).toEqual(MODEL_MOCK_ID);
      expect(state.modelCreationLoading).toBe(false);
    });
  });

  describe('on modelCreationFailure', () => {
    it('should set modelCreationSuccess', () => {
      const action: Action = modelCreateFailure();
      const state = bearingSelectionReducer(initialState, action);

      expect(state.modelCreationSuccess).toEqual(false);
      expect(state.modelCreationLoading).toBe(false);
    });
  });

  describe('on resetBearing', () => {
    it('should set the bearing state to its initial value', () => {
      const action: Action = resetBearing();
      const state = bearingSelectionReducer(
        { ...initialState, selectedBearing: 'mock-bearing' },
        action
      );

      expect(state.selectedBearing).toBeUndefined();
    });
  });
});
