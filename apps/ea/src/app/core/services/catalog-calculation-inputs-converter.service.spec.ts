import {
  API_INPUTS_MOCK,
  API_RESULT_MULTIPLE_LOADCASES_MOCK,
  EXPECTED_RESULT_MULTIPLE_LOADCASES_INPUTS,
} from '@ea/testing/mocks/catalog-helper-mocks';
import { TranslocoModule } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY,
  LOADCASE_NAME_FIELD_NAME_TRANSLATION_KEY,
} from './bearinx-result.constant';
import { BearinxOnlineResult } from './bearinx-result.interface';
import { CatalogCalculationInputsConverterService } from './catalog-calculation-inputs-converter.service';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((translateKey) => {
    switch (translateKey) {
      case LOADCASE_NAME_FIELD_NAME_TRANSLATION_KEY:
        return 'Load case';
      case LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY:
        return 'Des';
      default:
        return translateKey;
    }
  }),
}));

describe('CatalogCalculationInputsConverterService', () => {
  let service: CatalogCalculationInputsConverterService;
  let spectator: SpectatorService<CatalogCalculationInputsConverterService>;

  const createService = createServiceFactory({
    service: CatalogCalculationInputsConverterService,
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('convertCatalogInputsResponse', () => {
    it('should convert a valid result', () => {
      expect(
        service.convertCatalogInputsResponse(
          API_INPUTS_MOCK as BearinxOnlineResult
        )
      ).toMatchSnapshot();
    });

    it('should gracefully handle an invalid result', () => {
      const resultMock: Partial<BearinxOnlineResult> = {
        subordinates: [
          {
            titleID: 'STRING_OUTP_RESULTS_INVALID',
            identifier: 'block',
            subordinates: [],
          },
        ],
      };

      expect(
        service.convertCatalogInputsResponse(resultMock as BearinxOnlineResult)
      ).toEqual([]);
    });

    it('Should convert a valid result for multiple loadcases', () => {
      const result = service.convertCatalogInputsResponse(
        API_RESULT_MULTIPLE_LOADCASES_MOCK as BearinxOnlineResult
      );

      expect(result).toEqual(EXPECTED_RESULT_MULTIPLE_LOADCASES_INPUTS);
    });
  });
});
