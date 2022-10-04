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

jest.mock('@ga/shared/constants', () => ({
  bearings: ['mockValidBearing', 'mockValidAdvancedBearing'],
}));

describe('Bearing Selection Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
    bearingSelection: {
      ...initialState,
      quickBearingSelection: {
        ...initialState.quickBearingSelection,
        resultList: ['mockValidBearing', 'mockInvalidBearing'],
      },
      advancedBearingSelection: {
        ...initialState.advancedBearingSelection,
        resultList: ['mockValidAdvancedBearing', 'mockInvalidAdvancedBearing'],
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
          id: 'mockValidBearing',
          title: 'bearing.bearingSelection.quickSelection.selectOption',
          disabled: false,
        },
        {
          id: 'mockInvalidBearing',
          title: 'bearing.bearingSelection.quickSelection.disabledOption',
          disabled: true,
        },
      ]);
    });
  });

  describe('getAdvancedBearingSelectionResultList', () => {
    it('should return the Advanced Bearing Selection results list', () => {
      expect(getAdvancedBearingSelectionResultList(mockState)).toEqual([
        {
          id: 'mockValidAdvancedBearing',
          title: 'mockValidAdvancedBearing',
          disabled: false,
        },
        {
          id: 'mockInvalidAdvancedBearing',
          title: 'mockInvalidAdvancedBearing',
          disabled: true,
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
