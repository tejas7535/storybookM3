import { TranslocoModule } from '@jsverse/transloco';

import { TimePeriod } from '../../../shared/models';
import { EmployeeAnalytics } from '../../models';
import {
  createAgeFeature,
  createBarchartConfigForAge,
  createDummyBarChartSerie,
  mockTranslocoForAnalytics,
} from './attrition-analytics.selector.spec.factory';
import {
  createSubtitle,
  mapEmployeeAnalyticsFeatureToBarChartConfig,
  sortFeature,
} from './attrition-analytics.selector.utils';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((key: string, params: any) =>
    mockTranslocoForAnalytics(key, params)
  ),
}));
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
        totalEmployees: { headcount: 158, leavers: 7 },
        notApplicableEmployees: { headcount: 2, leavers: 1 },
      };

      const result = sortFeature(feature);

      expect(result).toEqual(expectedResult);
    });

    test('should return empty config if feature is undefined', () => {
      const result = sortFeature(undefined as any);

      expect(result).toBeUndefined();
    });

    test('should return empty config if feature is empty', () => {
      const feature: EmployeeAnalytics = {
        feature: 'translate it',
        overallFluctuationRate: 0.045,
        fluctuation: [] as number[],
        headcount: [] as number[],
        values: [] as string[],
        names: [] as string[],
        order: [] as number[],
        totalEmployees: {} as unknown as { headcount: number; leavers: number },
        notApplicableEmployees: {} as unknown as {
          headcount: number;
          leavers: number;
        },
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
        notApplicableEmployees: {} as unknown as {
          headcount: number;
          leavers: number;
        },
        totalEmployees: {} as unknown as { headcount: number; leavers: number },
      });
    });
  });

  describe('createSubtitle', () => {
    test('should create subtitle with not applicable headcount and leavers', () => {
      const feature = createAgeFeature();
      const expectedResult =
        'Total: Avg. Headcount 158 | Unf. Leavers 7\nof which not applicable: Avg. Headcount 2 | Unf. Leavers 1';

      const result = createSubtitle(feature);

      expect(result).toEqual(expectedResult);
    });

    test('should create subtitle with not applicable headcount', () => {
      const feature = createAgeFeature();
      feature.notApplicableEmployees.leavers = 0;
      feature.notApplicableEmployees.headcount = 10;
      const expectedResult =
        'Total: Avg. Headcount 158 | Unf. Leavers 7\nof which not applicable: Avg. Headcount 10';

      const result = createSubtitle(feature);

      expect(result).toEqual(expectedResult);
    });

    test('should create subtitle with not applicable leavers', () => {
      const feature = createAgeFeature();
      feature.notApplicableEmployees.leavers = 10;
      feature.notApplicableEmployees.headcount = 0;
      const expectedResult =
        'Total: Avg. Headcount 158 | Unf. Leavers 7\nof which not applicable: Unf. Leavers 10';

      const result = createSubtitle(feature);

      expect(result).toEqual(expectedResult);
    });

    test('should create subtitle without not applicable headcount and leavers when both are 0', () => {
      const feature = createAgeFeature();
      feature.notApplicableEmployees.headcount = 0;
      feature.notApplicableEmployees.leavers = 0;
      const expectedResult = 'Total: Avg. Headcount 158 | Unf. Leavers 7';

      const result = createSubtitle(feature);

      expect(result).toEqual(expectedResult);
    });

    test('should create subtitle without not applicable headcount and leavers when both are undfined', () => {
      const feature = createAgeFeature();
      feature.notApplicableEmployees.headcount = undefined;
      feature.notApplicableEmployees.leavers = undefined;
      const expectedResult = 'Total: Avg. Headcount 158 | Unf. Leavers 7';

      const result = createSubtitle(feature);

      expect(result).toEqual(expectedResult);
    });
  });
});
