import { FeatureParams } from '../../models/feature-params.model';
import { FeatureSelector } from '../../models/feature-selector.model';
import { AttritionAnalyticsState, initialState } from '..';
import {
  getAvailableFeatures,
  getAvailableFeaturesLoading,
  getBarChartConfigsForSelectedFeatures,
  getEmployeeAnalyticsLoading,
  getFeatureImportanceGroups,
  getFeatureImportanceHasNext,
  getFeatureImportanceLoading,
  getFeatureImportancePageable,
  getFeatureImportanceSort,
  getFeatureImportanceSortDirection,
  getFeatureOverallAttritionRate,
  getFeatureSelectors,
  getSelectedFeatureParams,
  getSelectedFeatures,
} from './attrition-analytics.selector';
import { createFakeState } from './attrition-analytics.selector.spec.factory';

describe('attrition analytics selector', () => {
  const fakeState: AttritionAnalyticsState = createFakeState();

  describe('getEmployeeAnalyticsLoading', () => {
    test('should return true if loading true', () => {
      expect(
        getEmployeeAnalyticsLoading.projector({
          employeeAnalytics: {
            features: {
              loading: true,
            },
          },
        })
      ).toBeTruthy();
    });

    test('should return false if loading false', () => {
      expect(
        getEmployeeAnalyticsLoading.projector({
          employeeAnalytics: {
            features: {
              loading: false,
            },
          },
        })
      ).toBeFalsy();
    });
  });

  describe('getAvailableFeatures', () => {
    test('should get available features', () => {
      const expectedResult = fakeState.employeeAnalytics.availableFeatures.data;
      const result = getAvailableFeatures.projector(fakeState);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAvailableFeaturesLoading', () => {
    test('should get available features', () => {
      const expectedResult =
        fakeState.employeeAnalytics.availableFeatures.loading;
      const result = getAvailableFeaturesLoading.projector(fakeState);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSelectedFeatureNames', () => {
    test('should get selected features', () => {
      expect(getSelectedFeatureParams.projector(fakeState)).toEqual(
        expect.arrayContaining([
          { feature: 'Position', region: 'Alasca', year: 2021, month: 4 },
        ])
      );
    });

    test('should return undefined when no features selected', () => {
      expect(getSelectedFeatureParams.projector(initialState)).toBeUndefined();
    });
  });

  describe('getFeatureSelectors', () => {
    test('should get feature selectors', () => {
      const ageFeature = { feature: 'Age' } as FeatureParams;
      const positionFeature = { feature: 'Position' } as FeatureParams;
      expect(
        getFeatureSelectors.projector(
          [ageFeature, positionFeature],
          [positionFeature]
        )
      ).toEqual([
        new FeatureSelector(ageFeature, false),
        new FeatureSelector(positionFeature, true),
      ]);
    });

    test('should return undefined when features undefined', () => {
      expect(
        getFeatureSelectors.projector(
          undefined as string[],
          undefined as string[]
        )
      ).toBeUndefined();
    });
  });

  describe('getSelectedFeatures', () => {
    test('should get selected features', () => {
      expect(getSelectedFeatures.projector(fakeState)).toEqual(
        fakeState.employeeAnalytics.features.data
      );
    });
  });

  describe('getFeatureOverallAttritionRate', () => {
    test('should get oerall attrition rate if features loaded', () => {
      expect(
        getFeatureOverallAttritionRate.projector(
          fakeState.employeeAnalytics.features.data
        )
      ).toEqual(
        fakeState.employeeAnalytics.features.data[0].overallAttritionRate * 100
      );
    });

    test('should return NaN otherwise', () => {
      expect(
        Number.isNaN(getFeatureOverallAttritionRate.projector([]))
      ).toBeTruthy();
    });
  });

  describe('getBarChartConfigForSelectedFeatures', () => {
    test('should get bar chart config for selected features', () => {
      const average = 0.045;
      const result = getBarChartConfigsForSelectedFeatures.projector(
        [fakeState.employeeAnalytics.features.data[0]],
        average
      );
      expect(result[0].categories.length).toEqual(3);
      expect(result[0].series.length).toEqual(1);
      expect(result[0].referenceValue).toEqual(4.5);
    });

    test('should return undefined when selected features undefined', () => {
      const average = 0.45;
      const result = getBarChartConfigsForSelectedFeatures.projector(
        undefined,
        average
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getFeatureImportanceLoading', () => {
    test('should return loading status', () => {
      const expectedResult = fakeState.featureImportance.loading;
      const result = getFeatureImportanceLoading.projector(fakeState);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getFeatureImportanceGroups', () => {
    test('should return data', () => {
      const expectedResult = fakeState.featureImportance.data;
      const result = getFeatureImportanceGroups.projector(fakeState);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getFeatureImportancePageable', () => {
    test('should return pageable', () => {
      const expectedResult = fakeState.featureImportance.pageable;
      const result = getFeatureImportancePageable.projector(fakeState);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getFeatureImportanceHasNext', () => {
    test('should return hasNext', () => {
      const expectedResult = fakeState.featureImportance.hasNext;
      const result = getFeatureImportanceHasNext.projector(fakeState);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getFeatureImportanceSort', () => {
    test('should return sort', () => {
      const expectedResult = fakeState.featureImportance.sort;
      const result = getFeatureImportanceSort.projector(fakeState);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getFeatureImportanceSortDirection', () => {
    test('should return sort direction', () => {
      const expectedResult = fakeState.featureImportance.sort.direction;
      const result = getFeatureImportanceSortDirection.projector(fakeState);

      expect(result).toEqual(expectedResult);
    });
  });
});
