import { TranslocoModule } from '@ngneat/transloco';

import { APP_STATE_MOCK, MODEL_MOCK_ID } from '@ga/testing/mocks';

import { initialState } from '../../reducers/bearing-selection/bearing-selection.reducer';
import {
  getAdvancedBearingSelectionFilters,
  getAdvancedBearingSelectionResultList,
  getAdvancedBearingSelectionResultsCount,
  getBearingSelectionLoading,
  getBearingSelectionType,
  getModelCreationLoading,
  getModelCreationSuccess,
  getModelId,
  getQuickBearingSelectionResultList,
  getSelectedBearing,
} from './bearing-selection.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('Bearing Selection Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
    bearingSelection: {
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

  describe('getModelCreationLoading', () => {
    it('should return loading latest status', () => {
      expect(getModelCreationLoading(mockState)).toBeFalsy();
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
          title: 'bearing.bearingSelection.quickSelection.selectOption',
        },
        {
          id: 'evenGreaterBearing',
          title: 'bearing.bearingSelection.quickSelection.selectOption',
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
