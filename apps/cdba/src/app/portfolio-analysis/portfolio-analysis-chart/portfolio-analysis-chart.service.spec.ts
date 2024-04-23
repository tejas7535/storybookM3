import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Currency } from '@cdba/shared/constants/currency';
import { CurrencyService } from '@cdba/shared/services/currency/currency.service';
import { PRODUCT_COST_ANALYSIS_MOCK } from '@cdba/testing/mocks/models/product-cost-analysis.mock';

import { PortfolioAnalysisChartService } from './portfolio-analysis-chart.service';

describe('PortfolioAnalysisChartService', () => {
  let spectator: SpectatorService<PortfolioAnalysisChartService>;
  let service: PortfolioAnalysisChartService;
  const localizeNumber = jest.fn();
  const numberInput = 1_234_567.891_011;
  const numberOutput = '1.234.567,89';
  const currency: `${Currency}` = 'EUR';

  const createService = createServiceFactory({
    service: PortfolioAnalysisChartService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(TranslocoLocaleService, { localizeNumber }),
      {
        provide: CurrencyService,
        useValue: {
          getCurrency: jest.fn(() => currency),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    localizeNumber.mockReturnValue(numberOutput);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return chart options', () => {
    const chartsOption = service.getEChartsOption([PRODUCT_COST_ANALYSIS_MOCK]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(chartsOption.dataset.source).toEqual([PRODUCT_COST_ANALYSIS_MOCK]);
  });

  it('should format the chart values', () => {
    // tests private method
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const lineValueFormat = service.formatValue(numberInput, 'line');
    expect(lineValueFormat).toEqual(`${numberOutput} %`);

    // tests private method
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const scatterValueFormat = service.formatValue(numberInput, 'scatter');
    expect(scatterValueFormat).toEqual(`${numberOutput} ${currency}`);
  });
});
