import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ComparisonChartService } from './comparison-chart.service';

describe('ComparisonChartService', () => {
  let spectator: SpectatorService<ComparisonChartService>;
  let service: ComparisonChartService;

  const createService = createServiceFactory({
    service: ComparisonChartService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [mockProvider(TranslocoLocaleService)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ComparisonChartService);

    service['transloco'].translate = jest.fn((input: any) => input);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('constants', () => {
    it('should intialize constants', () => {
      expect(service.PURCHASE).toEqual('compare.summary.common.purchase');
      expect(service.REMAINDER).toEqual('compare.summary.common.remainder');
      expect(service.MOH).toEqual('compare.summary.common.moh');
      expect(service.BURDEN).toEqual('compare.summary.common.burden');
      expect(service.LABOUR).toEqual('compare.summary.common.labour');
      expect(service.RAW_MATERIAL).toEqual(
        'compare.summary.common.rawMaterial'
      );
    });
  });
});
