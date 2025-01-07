import { DOWNSTREAM_API_RESULT_MOCK } from '@ea/testing/downstream-calculation-result.mock';
import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DownstreamAPIResponse } from './downstream-calculation.service.interface';
import { DownstreamCalculationInputsService } from './downstream-calculation-inputs.service';

describe('DownstreamCalculationInputsService', () => {
  let spectator: SpectatorService<DownstreamCalculationInputsService>;
  let translocoService: TranslocoService;
  const createService = createServiceFactory({
    service: DownstreamCalculationInputsService,

    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createService();
    translocoService = spectator.inject(TranslocoService);
    translocoService.translate = jest
      .fn()
      .mockImplementation((key: string) => key);
  });

  it('should create the service', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should format downstream inputs correctly', () => {
    const downstreamResponse: DownstreamAPIResponse = {
      ...DOWNSTREAM_API_RESULT_MOCK,
    };

    const result = spectator.service.formatDownstreamInputs(downstreamResponse);
    expect(result).toMatchSnapshot();
  });

  it('should format downstream fossil energy source inputs', () => {
    const downstreamResponse: DownstreamAPIResponse = {
      ...DOWNSTREAM_API_RESULT_MOCK,
      inputData: {
        ...DOWNSTREAM_API_RESULT_MOCK.inputData,
        operatingConditions: {
          ...DOWNSTREAM_API_RESULT_MOCK.inputData.operatingConditions,
          emissionFactor: 'LB_FOSSIL_ENERGY',
        },
      },
    };

    const result = spectator.service.formatDownstreamInputs(downstreamResponse);
    expect(result).toMatchSnapshot();
  });

  it('should create translation keys correctly', () => {
    const basePath = 'calculationResultReport.downstreamInputs.otherConditions';
    const keys = [
      'title',
      'temperature',
      'lubricationMethod',
      'greaseType',
      'operatingTimeInHours',
    ];
    const expectedKeys = {
      title: 'calculationResultReport.downstreamInputs.otherConditions.title',
      temperature:
        'calculationResultReport.downstreamInputs.otherConditions.temperature',
      lubricationMethod:
        'calculationResultReport.downstreamInputs.otherConditions.lubricationMethod',
      greaseType:
        'calculationResultReport.downstreamInputs.otherConditions.greaseType',
      operatingTimeInHours:
        'calculationResultReport.downstreamInputs.otherConditions.operatingTimeInHours',
    };

    const result = (spectator.service as any).createTranslationKeys(
      basePath,
      keys
    );
    expect(result).toEqual(expectedKeys);
  });
});
