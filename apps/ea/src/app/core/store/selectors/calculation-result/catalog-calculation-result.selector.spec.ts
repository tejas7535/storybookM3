import {
  APP_STATE_MOCK,
  CATALOG_CALCULATION_RESULT_STATE_MOCK,
} from '@ea/testing/mocks';

import {
  getBasicFrequencies,
  getVersions,
  isCalculationResultAvailable,
  isLoading,
} from './catalog-calculation-result.selector';

describe('Catalog Calculation Result Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
  };

  describe('getBasicFrequencies', () => {
    it('should return the basic frequencies', () => {
      expect(
        getBasicFrequencies({
          ...mockState,
          catalogCalculationResult: {
            ...mockState.catalogCalculationResult,
            basicFrequencies: 'my-result',
          },
        })
      ).toEqual('my-result');
    });
  });

  describe('isCalculationResultAvailable', () => {
    it('should return true if we have a result', () => {
      expect(isCalculationResultAvailable(mockState)).toEqual(
        !!CATALOG_CALCULATION_RESULT_STATE_MOCK.result
      );
    });
  });

  describe('isLoading', () => {
    it('should return true if loading is in progress', () => {
      expect(
        isLoading({
          ...mockState,
          catalogCalculationResult: {
            ...mockState.catalogCalculationResult,
            isLoading: true,
          },
        })
      ).toEqual(true);
    });
  });

  describe('getVersions', () => {
    it('should return undefined if there are no versions', () => {
      expect(
        getVersions({
          ...mockState,
          catalogCalculationResult: {
            ...mockState.catalogCalculationResult,
            versions: undefined,
          },
        })
      ).toBeUndefined();
    });

    it('should return undefined if the versions object is empty', () => {
      expect(
        getVersions({
          ...mockState,
          catalogCalculationResult: {
            ...mockState.catalogCalculationResult,
            versions: {},
          },
        })
      ).toBeUndefined();
    });

    it('should return the versions as a string', () => {
      expect(
        getVersions({
          ...mockState,
          catalogCalculationResult: {
            ...mockState.catalogCalculationResult,
            versions: {
              '1': 'v1',
              '2': 'v2',
            },
          },
        })
      ).toEqual('1 v1 / 2 v2');
    });
  });
});
