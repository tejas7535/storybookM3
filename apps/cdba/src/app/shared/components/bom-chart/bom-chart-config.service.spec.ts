import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { COLOR_PLATTE } from './bom-chart.constants';
import { BomChartConfigService } from './bom-chart-config.service';

describe('BomChartConfigService', () => {
  let service: BomChartConfigService;
  let spectator: SpectatorService<BomChartConfigService>;

  const createService = createServiceFactory({
    service: BomChartConfigService,
    providers: [mockProvider(TranslocoLocaleService)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(BomChartConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct chart series', () => {
    const barChartData = [
      {
        itemStyle: {
          color: COLOR_PLATTE[0],
        },
        name: 'FE-2313',
        value: 13,
      },
      {
        itemStyle: {
          color: COLOR_PLATTE[1],
        },
        name: 'FE-2315',
        value: 13,
      },
    ];

    const lineChartData = [50, 100];

    const result = service.getChartSeries(barChartData, lineChartData);

    expect(result.length).toEqual(2);
    expect(result[0].type).toEqual('bar');
    expect(result[0].data).toEqual(barChartData);
    expect(result[1].type).toEqual('line');
    expect(result[1].data).toEqual(lineChartData);
  });

  describe('getXAxisConfig', () => {
    let hasNegativeCostValues;
    let xAxisConfig;

    it('should set -20 as min of % axis when param true', () => {
      hasNegativeCostValues = true;

      xAxisConfig = service.getXAxisConfig(hasNegativeCostValues);

      expect(xAxisConfig[1].min).toEqual(-20);
    });

    it('should set 0 as min of % axis when param false', () => {
      hasNegativeCostValues = false;

      xAxisConfig = service.getXAxisConfig(hasNegativeCostValues);

      expect(xAxisConfig[1].min).toEqual(0);
    });
  });
});
