import { API_RESULT_MOCK } from '@ea/testing/mocks/catalog-helper-mocks';

import { BearinxOnlineResult } from './bearinx-result.interface';
import { convertCatalogCalculationResult } from './catalog-helper';

describe('Catalog Helper', () => {
  describe('convertCatalogCalculationResult', () => {
    it('Should convert a valid result', () => {
      expect(
        convertCatalogCalculationResult(
          API_RESULT_MOCK as BearinxOnlineResult,
          undefined
        )
      ).toMatchSnapshot();
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
          'calculation is not possible error msg'
        )
      ).toEqual({
        calculationError: {
          error: 'calculation is not possible error msg',
        },
      });
    });
  });
});
