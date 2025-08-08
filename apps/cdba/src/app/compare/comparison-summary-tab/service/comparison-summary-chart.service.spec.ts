import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ComparisonType } from '@cdba/shared/constants';
import {
  CHART_PRIMARY,
  CHART_SECONDARY,
  RADAR_CHART_REFERENCE_LINE,
} from '@cdba/shared/constants/colors';
import { COMPARISON_MOCK } from '@cdba/testing/mocks/models/comparison-summary.mock';

import { ComparisonChartService } from './comparison-chart.service';
import { ComparisonSummaryChartService } from './comparison-summary-chart.service';

jest.mock('@cdba/shared/constants/colors', () => ({
  ...jest.requireActual('@cdba/shared/constants/colors'),
  COST_SHARE_CATEGORY_COLORS: new Map([['default', '#TEST']]),
}));

describe('ComparisonSummaryChartService', () => {
  let spectator: SpectatorService<ComparisonSummaryChartService>;
  let service: ComparisonSummaryChartService;

  const createService = createServiceFactory({
    service: ComparisonSummaryChartService,
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
    service = spectator.inject(ComparisonSummaryChartService);

    service['transloco'].translate = jest.fn((input: any) => input);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('constants', () => {
    it('should provide table columns', () => {
      expect(service.provideSummaryTableColumns()).toEqual([
        'costType',
        'valueBom1',
        'valueBom2',
        'currency',
        'costDeltaValue',
        'costDeltaPercentage',
      ]);
    });
  });

  describe('radar chart', () => {
    it('should provide radar chart config', () => {
      const result = service.provideSummarizedRadarChartConfig(
        'firstMaterialDesignation',
        'secondMaterialDesignation',
        COMPARISON_MOCK
      );

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({
          legend: {
            bottom: '0%',
            left: '5%',
            data: [
              'compare.summary.common.referenceLine',
              'firstMaterialDesignation',
              'secondMaterialDesignation',
            ],
          },
          tooltip: {
            trigger: 'item',
            valueFormatter: (value: string) => `${value} EUR`,
          },
          toolbox: {
            feature: {
              saveAsImage: { show: true },
            },
          },
          radar: {
            indicator: [
              { name: 'compare.summary.common.purchase', min: -1, max: 1 },
              { name: 'compare.summary.common.remainder', min: -1, max: 1 },
              { name: 'compare.summary.common.moh', min: -1, max: 1 },
              { name: 'compare.summary.common.burden', min: -1, max: 1 },
              { name: 'compare.summary.common.labour', min: -1, max: 1 },
              { name: 'compare.summary.common.rawMaterial', min: -1, max: 1 },
            ],
          },
          series: [
            {
              type: 'radar',
              data: [
                {
                  name: 'compare.summary.common.referenceLine',
                  value: [0, 0, 0, 0, 0, 0],
                  itemStyle: {
                    color: RADAR_CHART_REFERENCE_LINE,
                  },
                },
                {
                  name: 'firstMaterialDesignation',
                  value: [0.5147, -0.0083, 0.0423, 0.1939, 0.0542, 0.0004],
                  itemStyle: {
                    color: CHART_PRIMARY,
                  },
                },
                {
                  name: 'secondMaterialDesignation',
                  value: [0.1392, -0.0277, 0.0666, 0.5217, 0.2301, 0.0144],
                  itemStyle: {
                    color: CHART_SECONDARY,
                  },
                },
              ],
            },
          ],
        })
      );
    });
  });

  describe('findCostDifferenceByComparisonType', () => {
    it('should find cost difference by comparison type', () => {
      const result = service.findCostDifferenceByComparisonType(
        COMPARISON_MOCK.summary,
        ComparisonType.PURCHASE
      );

      expect(result).toEqual({
        title: '',
        type: ComparisonType.PURCHASE,
        valueBom1: 0.5147,
        valueBom2: 0.1392,
        costDeltaPercentage: -72.96,
        costDeltaValue: -0.3755,
      });
    });

    it('should return undefined', () => {
      const result = service.findCostDifferenceByComparisonType(
        COMPARISON_MOCK.summary,
        'TEST' as unknown as ComparisonType
      );
      expect(result).toEqual(undefined);
    });
  });
});
