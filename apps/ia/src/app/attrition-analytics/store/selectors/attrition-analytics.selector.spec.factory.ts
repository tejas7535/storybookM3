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
    selectedByUser: {
      features: ['Position'],
    },
  };
}
export function createDummyFeature(name: string): EmployeeAnalyticsFeature {
  return {
    name,
    employeeCount: [50, 49, 59],
    values: ['18', '19', '20'],
    attritionCount: [2, 5, 7],
  };
}

export function createAgeFeature(): EmployeeAnalyticsFeature {
  return createDummyFeature('Age');
}

export function createDummyBarchartConfig(
  name: string,
  serie: BarChartSerie
): BarChartConfig {
  return new BarChartConfig(name, [serie], ['18', '19', '20'], 45);
}

export function createBarchartConfigForAge(
  serie: BarChartSerie
): BarChartConfig {
  return createDummyBarchartConfig('Age', serie);
}

export function createDummyBarChartSerie(color: string): BarChartSerie {
  return new BarChartSerie(
    [],
    [
      [4, 50],
      [10.2, 49],
      [11.86, 59],
    ],
    color
  );
}
