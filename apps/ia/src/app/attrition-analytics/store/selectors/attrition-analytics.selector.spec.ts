import { EmployeeAnalytics } from '../../models';
import { FeatureParams } from '../../models/feature-params.model';
import { FeatureSelector } from '../../models/feature-selector.model';
import { AttritionAnalyticsState, initialState } from '..';
import {
  getAvailableFeaturesForSelectedRegion,
  getAvailableFeaturesLoading,
  getBarChartConfigsForSelectedFeatures,
  getEmployeeAnalyticsLoading,
  getFeatureImportanceGroups,
  getFeatureImportanceHasNext,
  getFeatureImportanceLoading,
  getFeatureImportancePageable,
  getFeatureImportanceSort,
  getFeatureOverallAttritionRate,
  getFeatureSelectorsForSelectedRegion,
  getSelectedFeatureParams,
  getSelectedFeatures,
  getSelectedFeaturesForSelectedRegion,
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
        } as AttritionAnalyticsState)
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
        } as AttritionAnalyticsState)
      ).toBeFalsy();
    });
  });

  describe('getAvailableFeaturesForSelectedRegion', () => {
    test('should get available features for selected region', () => {
      const expectedResult = [
        fakeState.employeeAnalytics.availableFeatures.data[1],
      ];
      const result = getAvailableFeaturesForSelectedRegion.projector(
        fakeState.employeeAnalytics.availableFeatures.data,
        fakeState.employeeAnalytics.availableFeatures.data[1].region
      );

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
          { feature: 'Position', region: 'Asia', year: 2021, month: 4 },
        ])
      );
    });

    test('should return empty array when no features selected', () => {
      expect(getSelectedFeatureParams.projector(initialState)).toEqual([]);
    });
  });

  describe('getSelectedFeaturesForSelectedRegion', () => {
    test('should get selected features for region', () => {
      expect(
        getSelectedFeaturesForSelectedRegion.projector(
          fakeState.selectedByUser.features,
          fakeState.filter.selectedRegion
        )
      ).toEqual([
        { feature: 'Position', region: 'Asia', year: 2021, month: 4 },
      ]);
    });
  });

  describe('getFeatureSelectorsForSelectedRegion', () => {
    test('should get feature selectors', () => {
      const ageFeature = { feature: 'Age', region: 'World' } as FeatureParams;
      const positionFeature = {
        feature: 'Position',
        region: 'World',
      } as FeatureParams;
      expect(
        getFeatureSelectorsForSelectedRegion.projector(
          [ageFeature, positionFeature],
          [positionFeature],
          'World'
        )
      ).toEqual([
        new FeatureSelector(ageFeature, false),
        new FeatureSelector(positionFeature, true),
      ]);
    });

    test('should return undefined when features undefined', () => {
      expect(
        getFeatureSelectorsForSelectedRegion.projector(
          undefined as FeatureParams[],
          undefined as FeatureParams[],
          'World'
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
          fakeState.employeeAnalytics.features.data,
          fakeState.filter.selectedRegion
        )
      ).toEqual(
        fakeState.employeeAnalytics.features.data[1].overallAttritionRate
      );
    });

    test('should return undefined otherwise', () => {
      expect(
        getFeatureOverallAttritionRate.projector([], 'World')
      ).toBeUndefined();
    });
  });

  describe('getBarChartConfigForSelectedFeatures', () => {
    test('should get bar chart config for selected features', () => {
      const result = getBarChartConfigsForSelectedFeatures.projector([
        fakeState.employeeAnalytics.features.data[0],
      ]);
      expect(result[0].categories.length).toEqual(3);
      expect(result[0].series.length).toEqual(1);
      expect(result[0].referenceValue).toEqual(4.5);
    });

    test('should return undefined when selected features undefined', () => {
      const result = getBarChartConfigsForSelectedFeatures.projector(
        undefined as EmployeeAnalytics[]
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
});
