import { AttritionAnalyticsState, initialState } from '..';
import { FeatureParams } from '../../models/feature-params.model';
import { FeatureSelector } from '../../models/feature-selector.model';
import {
  getAvailableFeatures,
  getAvailableFeaturesLoading,
  getBarChartConfigsForSelectedFeatures,
  getEmployeeAnalyticsLoading,
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
});
