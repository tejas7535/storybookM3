import { AttritionAnalyticsState, initialState } from '..';
import { FeatureSelector } from '../../models/feature-selector.model';
import {
  getAllFeatureNames,
  getBarChartConfigsForSelectedFeatures,
  getEmployeeAnalyticsAverage,
  getEmployeeAnalyticsBarChartConfig,
  getEmployeeAnalyticsFeature,
  getFeatureSelectors,
  getSelectedFeatureNames,
  getSelectedFeatures,
} from './attrition-analytics.selector';
import {
  createAgeFeature,
  createBarchartConfigForAge,
  createDummyBarChartSerie,
  createFakeState,
} from './attrition-analytics.selector.spec.factory';

describe('attrition analytics selector', () => {
  const fakeState: AttritionAnalyticsState = createFakeState();

  describe('getEmployeeAnalyticsFeature', () => {
    test('should get employee anayltics feature by name', () => {
      const featureName = 'Age';

      expect(
        getEmployeeAnalyticsFeature(featureName).projector(fakeState)
      ).toEqual(createAgeFeature());
    });

    test('should return undefined when feature not found', () => {
      const featureName = 'not existing feature';

      expect(
        getEmployeeAnalyticsFeature(featureName).projector(fakeState)
      ).toBeUndefined();
    });

    test('should return undefined when data undefined', () => {
      const featureName = 'not existing feature';

      expect(
        getEmployeeAnalyticsFeature(featureName).projector(initialState)
      ).toBeUndefined();
    });
  });

  describe('getEmployeeAnalyticsAverage', () => {
    test('should get avarage', () => {
      expect(getEmployeeAnalyticsAverage.projector(fakeState)).toEqual(
        fakeState.employeeAnalytics.data.avgAttritionRate
      );
    });

    test('should return undefined when data undefined', () => {
      expect(
        getEmployeeAnalyticsAverage.projector(initialState)
      ).toBeUndefined();
    });
  });

  describe('getEmployeeAnalyticsBarChartConfig', () => {
    test('should get bar chart config for feature with color', () => {
      const featureName = 'Age';
      const color = '#000';
      const expectedSeries = createDummyBarChartSerie(color);
      const expectedResult = createBarchartConfigForAge(expectedSeries);

      expect(
        getEmployeeAnalyticsBarChartConfig(featureName, color).projector(
          fakeState.employeeAnalytics.data.features[0],
          fakeState.employeeAnalytics.data.avgAttritionRate
        )
      ).toEqual(expectedResult);
    });

    test('should return undefined when getEmployeeAnalyticsFeature undefined', () => {
      expect(
        getEmployeeAnalyticsBarChartConfig(
          'not existing feature',
          'red'
        ).projector(undefined, 0.5)
      ).toBeUndefined();
    });

    test('should return undefined when getEmployeeAnalyticsAverage undefined', () => {
      const featureName = 'Age';

      expect(
        getEmployeeAnalyticsBarChartConfig(featureName, 'red').projector(
          fakeState.employeeAnalytics.data.features[0],
          undefined as number
        )
      ).toBeUndefined();
    });

    test('should return undefined when feature and average undefined', () => {
      const featureName = 'Age';
      const color = '#000';

      expect(
        getEmployeeAnalyticsBarChartConfig(featureName, color).projector(
          undefined,
          undefined as number
        )
      ).toBeUndefined();
    });
  });

  describe('getAllFeatureNames', () => {
    test('should get all feature names', () => {
      const expectedNames = ['Age', 'Position'];

      expect(getAllFeatureNames.projector(fakeState)).toEqual(
        expect.arrayContaining(expectedNames)
      );
    });

    test('should return undefined when data undifined', () => {
      expect(getAllFeatureNames.projector(initialState)).toBeUndefined();
    });
  });

  describe('getSelectedFeatureNames', () => {
    test('should get selected features', () => {
      expect(getSelectedFeatureNames.projector(fakeState)).toEqual(
        expect.arrayContaining(['Position'])
      );
    });

    test('should return undefined when no features selected', () => {
      expect(getSelectedFeatureNames.projector(initialState)).toBeUndefined();
    });
  });

  describe('getFeatureSelectors', () => {
    test('should get feature selectors', () => {
      const ageFeature = 'Age';
      const positionFeature = 'Position';
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
      expect(getSelectedFeatures.projector(fakeState)).toEqual([
        fakeState.employeeAnalytics.data.features[1],
      ]);
    });
  });

  describe('getBarChartConfigForSelectedFeatures', () => {
    test('should get bar chart config for selected features', () => {
      const average = 0.45;
      const result = getBarChartConfigsForSelectedFeatures.projector(
        [fakeState.employeeAnalytics.data.features[0]],
        average
      );
      expect(result[0].categories.length).toEqual(3);
      expect(result[0].series.length).toEqual(1);
      expect(result[0].average).toEqual(45);
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
