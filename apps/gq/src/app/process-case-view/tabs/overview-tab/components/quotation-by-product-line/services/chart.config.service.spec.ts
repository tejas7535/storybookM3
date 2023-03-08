import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { TranslocoModule } from '@ngneat/transloco';
import { SeriesOption } from 'echarts';

import { BarChartData } from '../models/bar-chart-data.model';
import { ChartConfigService } from './chart.config.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('ChartConfigService', () => {
  let service: ChartConfigService;
  let spectator: SpectatorService<ChartConfigService>;

  const barChartData: BarChartData[] = [
    {
      gpm: '10',
      name: 'name1',
      share: '5%',
      value: 15,
    },
    {
      gpm: '10',
      name: 'name2',
      share: '5%',
      value: 20,
    },
  ];

  const createService = createServiceFactory({
    service: ChartConfigService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('getLegendConfig', () => {
    test('should return tooltipconfig', () => {
      service.getLegendFormatter = jest.fn();
      const formatter = service.getLegendFormatter;

      const expected = {
        ...service.LEGEND,
        formatter: (param: any) => formatter(param),
      };
      const result = service.getLegendConfig();

      expect(JSON.stringify(expected)).toEqual(JSON.stringify(result));
    });
  });
  describe('getTooltipConfig', () => {
    test('should return tooltipconfig', () => {
      service.getTooltipFormatter = jest.fn();
      const formatter = service.getTooltipFormatter;

      const expected = {
        ...service.TOOLTIP_CONFIG,
        formatter: (param: any) => formatter(param),
      };
      const result = service.getTooltipConfig();

      expect(JSON.stringify(expected)).toEqual(JSON.stringify(result));
    });
  });

  describe('getSeriesConfig', () => {
    test('shall return the config', () => {
      const result = service.getSeriesConfig(barChartData);
      const expected: SeriesOption[] = [
        {
          type: 'bar',
          stack: 'total',
          name: barChartData[0].name,
          data: [barChartData[0]],
          itemStyle: {
            borderRadius: [10, 0, 0, 10],
          },
        },
        {
          type: 'bar',
          stack: 'total',
          name: barChartData[1].name,
          data: [barChartData[1]],
          itemStyle: {
            borderRadius: [0, 10, 10, 0],
          },
        },
      ];
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getLegend', () => {
    test('shall return the legend', () => {
      service.getSeriesConfig(barChartData);
      const result = service.getLegend(service.seriesConfig);
      const expected = {
        ...service.LEGEND,
        data: [
          {
            icon: 'square',
            name: 'name1',
          },
          {
            icon: 'square',
            name: 'name2',
          },
        ],
      };
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getXAxisConfig', () => {
    test('should return X_AXIS_CONFIG', () => {
      const max = 35;

      const result = service.getXAxisConfig(barChartData);

      expect(result).toEqual({ ...service.X_AXIS_CONFIG, max });
    });
  });

  describe('getTooltipFormatter', () => {
    test('should create Tooltip', () => {
      const param = { data: barChartData[0] };
      const result = service.getTooltipFormatter(param);
      // checks if value have been set into the text
      expect(result).toContain(
        '<span class="text-body-2 text-high-emphasis">10</span>'
      );
      expect(result).toContain(
        '<span class="text-body-2 text-high-emphasis">5%</span>'
      );
      expect(result).toContain(
        '<span class="text-body-2 font-semibold text-high-emphasis">name1</span>'
      );
    });
  });

  describe('getLegendFormatter', () => {
    test('should return legendText', () => {
      service.seriesConfig = [
        {
          type: 'bar',
          stack: 'total',
          name: barChartData[0].name,
          data: barChartData,
        },
      ];
      const params = 'name1';
      const result = service.getLegendFormatter(params);
      expect(result).toBe('name1 5%');
    });
  });
});
