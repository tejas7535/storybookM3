import { ReferenceValue } from '../../../shared/charts/models';
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
            allFeaturesCount: 10,
            color: 'red',
          },
          {
            name: 'Time Management',
            allFeaturesCount: 7,
            color: 'red',
          },
        ],
        errorMessage: undefined,
        loading: false,
      },
      selected: 'Personal',
    },
    employeeAnalytics: {
      data: [
        {
          feature: 'Age',
          overallFluctuationRate: 0.045,
          headcount: [50, 49, 59],
          values: ['18', '19', '20'],
          fluctuation: [2, 5, 7],
          names: ['a', 'b', 'c'],
          order: [2, 3, 1],
        },
      ],
      errorMessage: undefined,
      loading: false,
    },
  };
}
export function createDummyFeature(name: string): EmployeeAnalytics {
  return {
    feature: name,
    overallFluctuationRate: 0.045,
    headcount: [50, 49, 59],
    values: ['18', '19', '20'],
    fluctuation: [2, 5, 7],
    names: ['a', 'b', 'c'],
    order: [2, 3, 1],
  };
}

export function createAgeFeature(): EmployeeAnalytics {
  return createDummyFeature('translate it');
}

export function createDummyBarchartConfig(
  name: string,
  serie: BarChartSerie,
  xAxisSize: number = 20
): BarChartConfig {
  return new BarChartConfig(
    name,
    [serie],
    ['c', 'a', 'b'],
    new ReferenceValue(0.045, 'translate it', 'translate it', 'translate it'),
    xAxisSize
  );
}

export function createBarchartConfigForAge(
  serie: BarChartSerie,
  xAxisSize: number = 20
): BarChartConfig {
  return createDummyBarchartConfig(serie.names[0], serie, xAxisSize);
}

export function createDummyBarChartSerie(color: string): BarChartSerie {
  return new BarChartSerie(
    ['translate it', 'translate it', 'translate it'],
    [
      [11.9, 59, 7],
      [4, 50, 2],
      [10.2, 49, 5],
    ],
    color
  );
}
