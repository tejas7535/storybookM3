import { TimePeriod } from '../../../shared/models';
import {
  createAgeFeature,
  createBarchartConfigForAge,
  createDummyBarChartSerie,
} from './attrition-analytics.selector.spec.factory';
import {
  mapEmployeeAnalyticsFeatureToBarChartConfig,
  sortFeature,
} from './attrition-analytics.selector.utils';

describe('attrition analytics selector utils', () => {
  describe('mapEmployeeAnalyticsFeatureToBarChartConfig', () => {
    test('should map employee analytics feature to bar chart config when time period month', () => {
      const feature = createAgeFeature();
      const color = '#000';
      const serie = createDummyBarChartSerie(color);
      const expectedResult = createBarchartConfigForAge(serie, 5);

      const result = mapEmployeeAnalyticsFeatureToBarChartConfig(
        feature,
        color,
        TimePeriod.MONTH
      );

      expect(result).toEqual(expectedResult);
    });

    test('should map employee analytics feature to bar chart config when time period last 12 months', () => {
      const feature = createAgeFeature();
      const color = '#000';
      const serie = createDummyBarChartSerie(color);
      const expectedResult = createBarchartConfigForAge(serie, 20);

      const result = mapEmployeeAnalyticsFeatureToBarChartConfig(
        feature,
        color,
        TimePeriod.LAST_12_MONTHS
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('sortFeature', () => {
    test('should sort feature by headcount', () => {
      const feature = createAgeFeature();
      const expectedResult = {
        feature: 'translate it',
        overallFluctuationRate: 0.045,
        headcount: [59, 50, 49],
        values: ['20', '18', '19'],
        fluctuation: [7, 2, 5],
        names: ['c', 'a', 'b'],
        order: [1, 2, 3],
      };

      const result = sortFeature(feature);

      expect(result).toEqual(expectedResult);
    });

    test('should return empty config if feature is undefined', () => {
      const result = sortFeature(undefined as any);

      expect(result).toBeUndefined();
    });

    test('should return empty config if feature is empty', () => {
      const feature = {
        feature: 'translate it',
        overallFluctuationRate: 0.045,
        fluctuation: [] as number[],
        headcount: [] as number[],
        values: [] as string[],
        names: [] as string[],
        order: [] as number[],
      };

      const result = sortFeature(feature);

      expect(result).toEqual({
        feature: 'translate it',
        overallFluctuationRate: 0.045,
        fluctuation: [] as number[],
        headcount: [] as number[],
        names: [] as string[],
        values: [] as string[],
        order: [] as number[],
      });
    });
  });
});
