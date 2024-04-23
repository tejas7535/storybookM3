import {
  API_RESULT_MOCK,
  API_RESULT_MULTIPLE_LOADCASES_MOCK,
  EXPECTED_RESULT_MULTIPLE_LOADCASES,
} from '@ea/testing/mocks/catalog-helper-mocks';
import { TranslocoModule } from '@jsverse/transloco';

import {
  LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY,
  LOADCASE_NAME_FIELD_NAME_TRANSLATION_KEY,
} from './bearinx-result.constant';
import { BearinxOnlineResult } from './bearinx-result.interface';
import { convertCatalogCalculationResult } from './catalog-helper';

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

describe('Catalog Helper', () => {
  describe('convertCatalogCalculationResult', () => {
    it('Should convert a valid result', () => {
      expect(
        convertCatalogCalculationResult(
          API_RESULT_MOCK as BearinxOnlineResult,
          undefined,
          false
        )
      ).toMatchSnapshot();
    });

    it('Should convert a valid result for multiple loadcases', () => {
      expect(
        convertCatalogCalculationResult(
          API_RESULT_MULTIPLE_LOADCASES_MOCK as BearinxOnlineResult,
          undefined,
          true
        )
      ).toEqual(EXPECTED_RESULT_MULTIPLE_LOADCASES);
    });

    it('Should gracefully handle an invalid result', () => {
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
        convertCatalogCalculationResult(
          resultMock as BearinxOnlineResult,
          'calculation is not possible error msg',
          false
        )
      ).toEqual({
        calculationError: {
          error: 'calculation is not possible error msg',
        },
        reportMessages: {
          errors: [],
          notes: [],
          warnings: [],
        },
      });
    });
  });
});
