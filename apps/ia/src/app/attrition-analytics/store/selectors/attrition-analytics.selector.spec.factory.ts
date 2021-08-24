import { AttritionAnalyticsState } from '..';
import { BarChartConfig } from '../../../shared/charts/models/bar-chart-config.model';
import { BarChartSerie } from '../../../shared/charts/models/bar-chart-serie.model';
import { EmployeeAnalyticsFeature } from '../../models/employee-analytics-feature.model';

export function createFakeState(): AttritionAnalyticsState {
  return {
    employeeAnalytics: {
      data: {
        region: 'Greater China',
        avgAttritionRate: 0.45,
        timePeriod: '2021 - 2022',
        features: [
          createAgeFeature(),
          {
            name: 'Position',
            employeeCount: [100, 20],
            values: ['CEO', 'Developer'],
            attritionCount: [2, 5],
          },
        ],
      },
      errorMessage: undefined,
      loading: false,
    },
  };
}

export function createAgeFeature(): EmployeeAnalyticsFeature {
  return {
    name: 'Age',
    employeeCount: [50, 49, 59],
    values: ['18', '19', '20'],
    attritionCount: [2, 5, 7],
  };
}

export function createBarchartConfigForAge(
  serie: BarChartSerie
): BarChartConfig {
  return new BarChartConfig(
    'Age',
    [serie],
    ['18', '19', '20'],
    0.45,
    'Below average',
    'Above average'
  );
}

export function createBarChartSerieForAge(color: string): BarChartSerie {
  return new BarChartSerie(
    ['Attr. Rate', 'num. Employees'],
    [
      [4, 50],
      [10.2, 49],
      [11.86, 59],
    ],
    color
  );
}
