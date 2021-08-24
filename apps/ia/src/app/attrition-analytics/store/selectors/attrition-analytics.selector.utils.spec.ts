import {
  createAgeFeature,
  createBarchartConfigForAge,
  createBarChartSerieForAge,
} from './attrition-analytics.selector.spec.factory';
import { mapEmployeeAnalyticsFeatureToBarChartConfig } from './attrition-analytics.selector.utils';

describe('attrition analytics selector utils', () => {
  describe('mapEmployeeAnalyticsFeatureToBarChartConfig', () => {
    test('should map employee analytics feature to bar chart config', () => {
      const feature = createAgeFeature();
      const color = '#000';
      const serie = createBarChartSerieForAge(color);
      const expectedResult = createBarchartConfigForAge(serie);

      const result = mapEmployeeAnalyticsFeatureToBarChartConfig(
        feature,
        expectedResult.average,
        color
      );

      expect(result).toEqual(expectedResult);
    });
  });
});
