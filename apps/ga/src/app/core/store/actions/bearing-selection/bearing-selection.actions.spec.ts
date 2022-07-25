import { MODEL_MOCK_ID } from '@ga/testing/mocks';

import { initialState as BearingState } from '../../reducers/bearing-selection/bearing-selection.reducer';
import {
  advancedBearingSelectionFailure,
  advancedBearingSelectionSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  searchBearingForAdvancedSelection,
  selectBearing,
} from './bearing-selection.actions';

describe('Bearing Actions', () => {
  describe('Search Bearing', () => {
    it('searchBearing', () => {
      const query = 'searchQuery';
      const action = searchBearing({ query });

      expect(action).toEqual({
        query,
        type: '[Bearing Selection] Search Bearing',
      });
    });
  });

  describe('Search Bearing Success', () => {
    it('bearingSearchSuccess', () => {
      const resultList = ['bearing 1', 'bearing 2'];
      const action = bearingSearchSuccess({ resultList });

      expect(action).toEqual({
        resultList,
        type: '[Bearing Selection] Search Bearing Success',
      });
    });
  });

  describe('Search Bearing For Advanced Selection', () => {
    it('searchBearingForAdvancedSelection', () => {
      const mockParameters = {
        ...BearingState.advancedBearingSelection.filters,
        pattern: 'testquery',
      };
      const action = searchBearingForAdvancedSelection({
        selectionFilters: mockParameters,
      });

      expect(action).toEqual({
        type: '[Bearing Selection] Search Bearing For Advanced Selection',
        selectionFilters: mockParameters,
      });
    });
  });

  describe('Search Bearing For Advanced Selection Success', () => {
    it('advancedBearingSelectionSuccess', () => {
      const resultList = ['advanced bearing 1', 'advanced bearing 2'];
      const action = advancedBearingSelectionSuccess({ resultList });

      expect(action).toEqual({
        resultList,
        type: '[Bearing Selection] Search Bearing For Advanced Selection Success',
      });
    });
  });

  describe('Search Bearing For Advanced Selection Failure', () => {
    it('advancedBearingSelectionFailure', () => {
      const action = advancedBearingSelectionFailure();

      expect(action).toEqual({
        type: '[Bearing Selection] Search Bearing For Advanced Selection Failure',
      });
    });
  });

  describe('Model Create Success', () => {
    it('modelCreateSuccess', () => {
      const action = modelCreateSuccess({ modelId: MODEL_MOCK_ID });

      expect(action).toEqual({
        modelId: MODEL_MOCK_ID,
        type: '[Bearing Selection] Model Create Success',
      });
    });
  });

  describe('Model Create Failure', () => {
    it('modelCreateFailure', () => {
      const action = modelCreateFailure();

      expect(action).toEqual({
        type: '[Bearing Selection] Model Create Failure',
      });
    });
  });

  describe('Select Bearing', () => {
    it('selectBearing', () => {
      const bearing = 'bearingName';
      const action = selectBearing({ bearing });

      expect(action).toEqual({
        bearing,
        type: '[Bearing Selection] Select Bearing',
      });
    });
  });
});
