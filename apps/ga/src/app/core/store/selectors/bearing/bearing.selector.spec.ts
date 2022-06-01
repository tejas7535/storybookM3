import { MODEL_MOCK_ID } from '@ga/testing/mocks';

import {
  BearingState,
  initialState,
} from '../../reducers/bearing/bearing.reducer';
import {
  getAdvancedBearingSelectionFilters,
  getAdvancedBearingSelectionResultList,
  getAdvancedBearingSelectionResultsCount,
  getBearingSelectionLoading,
  getBearingSelectionType,
  getModelCreationSuccess,
  getModelId,
  getQuickBearingSelectionResultList,
  getSelectedBearing,
} from './bearing.selector';

describe('Bearing Selector', () => {
  const mockState: { bearing: BearingState } = {
    bearing: {
      ...initialState,
      quickBearingSelection: {
        ...initialState.quickBearingSelection,
        resultList: ['greatBearing', 'evenGreaterBearing'],
      },
      advancedBearingSelection: {
        ...initialState.advancedBearingSelection,
        resultList: ['advancedgreatBearing', 'evenMoreAdvancedgreatBearing'],
        resultsCount: 3,
      },
      bearingSelectionType: 'QUICK_SELECTION',
    },
  };

  describe('getBearingSelectionType', () => {
    it('should return the bearing selection type', () => {
      expect(getBearingSelectionType(mockState)).toBe('QUICK_SELECTION');
    });
  });

  describe('getBearingSelectionLoading', () => {
    it('should return loading latest status', () => {
      expect(getBearingSelectionLoading(mockState)).toBeFalsy();
    });
  });

  describe('getSelectedBearing', () => {
    it('should return the selected bearing', () => {
      expect(
        getSelectedBearing.projector({
          ...initialState,
          selectedBearing: 'a selected bearing',
        })
      ).toEqual('a selected bearing');
    });
  });

  describe('getModelId', () => {
    it('should return the the modelId', () => {
      expect(
        getModelId.projector({
          ...initialState,
          modelId: MODEL_MOCK_ID,
        })
      ).toEqual(MODEL_MOCK_ID);
    });
  });

  describe('getModelCreationSuccess', () => {
    it('should return modelCreationSuccess', () => {
      expect(getModelCreationSuccess(mockState)).toEqual(undefined);
    });
  });

  describe('getAdvancedBearingSelectionFilters', () => {
    it('should return the result list', () => {
      expect(getAdvancedBearingSelectionFilters(mockState)).toEqual(
        initialState.advancedBearingSelection.filters
      );
    });
  });

  describe('getQuickBearingSelectionResultList', () => {
    it('should return the result list', () => {
      expect(getQuickBearingSelectionResultList(mockState)).toEqual([
        {
          id: 'greatBearing',
          title: 'greatBearing',
        },
        {
          id: 'evenGreaterBearing',
          title: 'evenGreaterBearing',
        },
      ]);
    });
  });

  describe('getAdvancedBearingSelectionResultList', () => {
    it('should return the Advanced Bearing Selection results list', () => {
      expect(getAdvancedBearingSelectionResultList(mockState)).toEqual([
        {
          id: 'advancedgreatBearing',
          title: 'advancedgreatBearing',
        },
        {
          id: 'evenMoreAdvancedgreatBearing',
          title: 'evenMoreAdvancedgreatBearing',
        },
      ]);
    });
  });

  describe('getAdvancedBearingSelectionResultsCount', () => {
    it('should return the Advanced Bearing Selection results list', () => {
      expect(getAdvancedBearingSelectionResultsCount(mockState)).toBe(3);
    });
  });
});
