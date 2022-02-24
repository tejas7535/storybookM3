import { BarChartConfig } from '../../../shared/charts/models/bar-chart-config.model';
import { BarChartSerie } from '../../../shared/charts/models/bar-chart-serie.model';
import { FeatureImportanceType, SortDirection } from '../../models';
import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import { AttritionAnalyticsState } from '..';

export function createFakeState(): AttritionAnalyticsState {
  return {
    employeeAnalytics: {
      features: {
        data: [
          {
            feature: 'Age',
            region: 'Greater China',
            overallAttritionRate: 0.045,
            year: 2021,
            month: 12,
            employeeCount: [50, 49, 59],
            values: ['18', '19', '20'],
            attritionCount: [2, 5, 7],
          },
          {
            feature: 'Position',
            region: 'Asia',
            year: 2021,
            month: 4,
            overallAttritionRate: 0.06,
            employeeCount: [100, 20],
            values: ['CEO', 'Developer'],
            attritionCount: [2, 5],
          },
        ],
        errorMessage: undefined,
        loading: false,
      },
      availableFeatures: {
        data: [
          { feature: 'Age', region: 'Greater China', year: 2021, month: 12 },
          { feature: 'Position', region: 'Alasca', year: 2021, month: 4 },
          { feature: 'Service length', region: 'Japan', year: 2020, month: 8 },
        ],
        loading: false,
        errorMessage: undefined,
      },
    },
    featureImportance: {
      loading: true,
      data: [
        {
          feature: 'Test a',
          type: FeatureImportanceType.CATEGORICAL,
          dataPoints: [
            {
              shapValue: 213.2,
              yaxisPos: 12,
              value: 'Unit',
              // eslint-disable-next-line unicorn/no-null
              colorMap: null,
            },
          ],
        },
      ],
      hasNext: true,
      pageable: {
        pageNumber: 0,
        pageSize: 1,
      },
      sort: {
        property: 'max_y_pos',
        direction: SortDirection.DESC,
      },
      errorMessage: undefined,
    },
    selectedByUser: {
      features: [
        { feature: 'Position', region: 'Alasca', year: 2021, month: 4 },
      ],
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
  return createDummyBarchartConfig('Age', serie);
}

export function createDummyBarChartSerie(color: string): BarChartSerie {
  return new BarChartSerie(
    ['translate it', 'translate it', 'translate it'],
    [
      [4, 50, 2],
      [10.2, 49, 5],
      [11.86, 59, 7],
    ],
    color
  );
}
