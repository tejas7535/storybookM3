import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PortfolioAnalysisTableService } from './portfolio-analysis-table.service';

describe('PortfolioAnalysisTableService', () => {
  let spectator: SpectatorService<PortfolioAnalysisTableService>;
  let service: PortfolioAnalysisTableService;
  const localizeNumber = jest.fn();
  const numberInput = 1_234_567.891_011;
  const numberOutput = '1.234.567,89';

  const createService = createServiceFactory({
    service: PortfolioAnalysisTableService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [mockProvider(TranslocoLocaleService, { localizeNumber })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    localizeNumber.mockReturnValue(numberOutput);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return label column', () => {
    const labelColumn = service.getLabelColumn();

    expect(labelColumn.field).toEqual('label');
  });

  it('should return data fields', () => {
    const dataFields = service.getDataFields();

    expect(dataFields.length).toEqual(5);
  });

  it('should format the table values', () => {
    const sqvValueFormat = service.formatValue(numberInput, 'sqvMargin');
    expect(sqvValueFormat).toEqual(`${numberOutput}%`);

    const gpcValueFormat = service.formatValue(numberInput, 'gpcMargin');
    expect(gpcValueFormat).toEqual(`${numberOutput}%`);

    const defaultValueFormat = service.formatValue(numberInput, 'default');
    expect(defaultValueFormat).toEqual(numberOutput);
  });
});
