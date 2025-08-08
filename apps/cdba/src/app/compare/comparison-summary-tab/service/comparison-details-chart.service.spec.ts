import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ComparisonDetail } from '@cdba/shared/models/comparison.model';
import { COMPARISON_DETAILS_MOCK } from '@cdba/testing/mocks/models/comparison-summary.mock';

import { ComparisonChartService } from './comparison-chart.service';
import { ComparisonDetailsChartService } from './comparison-details-chart.service';

jest.mock('@cdba/shared/constants/colors', () => ({
  ...jest.requireActual('@cdba/shared/constants/colors'),
  COST_SHARE_CATEGORY_COLORS: new Map([['default', '#TEST']]),
}));

describe('ComparisonDetailsChartService', () => {
  let spectator: SpectatorService<ComparisonDetailsChartService>;
  let service: ComparisonDetailsChartService;

  const createService = createServiceFactory({
    service: ComparisonDetailsChartService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(TranslocoLocaleService),
      {
        provide: ComparisonChartService,
        useValue: {
          PURCHASE: 'compare.summary.common.purchase',
          REMAINDER: 'compare.summary.common.remainder',
          MOH: 'compare.summary.common.moh',
          BURDEN: 'compare.summary.common.burden',
          LABOUR: 'compare.summary.common.labour',
          RAW_MATERIAL: 'compare.summary.common.rawMaterial',
          TOTAL: 'compare.summary.common.total',
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ComparisonDetailsChartService);

    service['costShareService'].getCostShareCategory = jest.fn(() => 'default');
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('provideParetoChartConfig', () => {
    it('should provide pareto chart config', () => {
      const result = service.provideParetoChartConfig(
        COMPARISON_DETAILS_MOCK,
        'EUR'
      );

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999',
              },
            },
          },
          toolbox: {
            feature: {
              saveAsImage: {
                show: true,
              },
            },
          },
          xAxis: [
            {
              type: 'category',
              data: ['GEH', 'AU', 'ASEH', 'SLHS'],
              axisPointer: {
                type: 'shadow',
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              min: 0.0613,
              max: 0.397,
              axisLabel: {
                formatter: (value: string) => `${value} EUR`,
              },
            },
            {
              type: 'value',
              min: 0,
              max: 100,
              interval: 10,
              axisLabel: {
                formatter: (value: string) => `${value} %`,
              },
            },
          ],
          series: [
            {
              type: 'bar',
              tooltip: {
                valueFormatter: (value: number) =>
                  `${service['localeService'].localizeNumber(value, 'decimal')} EUR`,
              },
              data: [
                {
                  name: 'GEH',
                  value: 0.397,
                  itemStyle: {
                    color: '#TEST',
                  },
                },
                {
                  name: 'AU',
                  value: 0.1194,
                  itemStyle: {
                    color: '#TEST',
                  },
                },
                {
                  name: 'ASEH',
                  value: 0.0631,
                  itemStyle: {
                    color: '#TEST',
                  },
                },
                {
                  name: 'SLHS',
                  value: 0.0613,
                  itemStyle: {
                    color: '#TEST',
                  },
                },
              ],
            },
            {
              type: 'line',
              color: '#CB0B15',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: (value: string) => `${value} %`,
              },
              data: [49.8, 64.78, 72.7, 80.39],
            },
          ],
        })
      );
    });
  });

  describe('bar chart', () => {
    it('should throw error', () => {
      const mock = {
        costDifferences: [{ type: 'TEST' }],
      } as unknown as ComparisonDetail;

      expect(() => {
        service.provideDetailedBarChartConfig(mock, '', '');
      }).toThrow('Invalid Comparison Type: TEST');
    });

    it('should provide bar chart config', () => {
      const result = service.provideDetailedBarChartConfig(
        COMPARISON_DETAILS_MOCK[0],
        'firstMaterialDesignation',
        'secondMaterialDesignation'
      );

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          xAxis: {
            type: 'category',
            data: [
              'compare.summary.common.purchase',
              'compare.summary.common.rawMaterial',
              'compare.summary.common.labour',
              'compare.summary.common.burden',
              'compare.summary.common.moh',
              'compare.summary.common.remainder',
              'compare.summary.common.total',
            ],
            axisLabel: {
              interval: 0,
              width: 200,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              type: 'bar',
              name: 'firstMaterialDesignation',
              data: [0.3188, 0, 0.0115, 0.0479, 0.0211, -0.0023, 0.1],
              itemStyle: {
                color: '#00893D',
              },
            },
            {
              type: 'bar',
              name: 'secondMaterialDesignation',
              data: [0, 0, 0.0777, 0.2053, 0.0086, -0.0077, 0.1],
              itemStyle: {
                color: '#20617C',
              },
            },
          ],
        })
      );
    });
  });
});
