import { AttritionAnalyticsState, initialState } from '..';
import {
  getEmployeeAnalyticsAverage,
  getEmployeeAnalyticsBarChartConfig,
  getEmployeeAnalyticsFeature,
} from './attrition-analytics.selector';
import {
  createAgeFeature,
  createBarchartConfigForAge,
  createBarChartSerieForAge,
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
      const expectedSeries = createBarChartSerieForAge(color);
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
});
