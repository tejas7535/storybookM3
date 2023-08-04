import {
  API_RESULT_MOCK,
  EXPECTED_RESULT,
} from '@ea/testing/mocks/catalog-helper-mocks';

import { BearinxOnlineResult } from './bearinx-result.interface';
import { convertCatalogCalculationResult } from './catalog-helper';

describe('Catalog Helper', () => {
  describe('convertCatalogCalculationResult', () => {
    it('Should convert a valid result', () => {
      expect(
        convertCatalogCalculationResult(API_RESULT_MOCK as BearinxOnlineResult)
      ).toEqual(EXPECTED_RESULT);
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
        convertCatalogCalculationResult(resultMock as BearinxOnlineResult)
      ).toEqual({});
    });
  });
});
