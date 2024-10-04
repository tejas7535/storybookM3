import { BarChartConfig } from '../../../shared/charts/models/bar-chart-config.model';
import { BarChartSerie } from '../../../shared/charts/models/bar-chart-serie.model';
import { EmployeeAnalytics } from '../../models';
import { AttritionAnalyticsState } from '..';

export function createFakeState(): AttritionAnalyticsState {
  return {
    clusters: {
      data: {
        data: [
          {
            name: 'Personal',
            allFeatures: 10,
            availableFeatures: 7,
          },
          {
            name: 'Time Management',
            allFeatures: 7,
            availableFeatures: 3,
          },
        ],
        errorMessage: undefined,
        loading: false,
      },
      selected: 'Personal',
    },
  };
}
export function createDummyFeature(name: string): EmployeeAnalytics {
  return {
    feature: name,
    region: 'Greater China',
    overallAttritionRate: 0.045,
    year: 2021,
    month: 12,
    employeeCount: [50, 49, 59],
    values: ['18', '19', '20'],
    attritionCount: [2, 5, 7],
  };
}

export function createAgeFeature(): EmployeeAnalytics {
  return createDummyFeature('Age');
}

export function createDummyBarchartConfig(
  name: string,
  serie: BarChartSerie
): BarChartConfig {
  return new BarChartConfig(
    name,
    [serie],
    ['18', '19', '20'],
    45,
    'translate it',
    'translate it',
    'translate it'
  );
}

export function createBarchartConfigForAge(
  serie: BarChartSerie
): BarChartConfig {
  return createDummyBarchartConfig('translate it', serie);
}

export function createDummyBarChartSerie(color: string): BarChartSerie {
  return new BarChartSerie(
    ['translate it', 'translate it', 'translate it'],
    [
      [4, 50, 2],
      [10.2, 49, 5],
      [11.9, 59, 7],
    ],
    color
  );
}
