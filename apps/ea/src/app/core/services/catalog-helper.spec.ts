import { CatalogCalculationResult } from '../store/models';
import { BearinxOnlineResult } from './bearinx-result.interface';
import { convertCatalogCalculationResult } from './catalog-helper';

describe('Catalog Helper', () => {
  describe('convertCatalogCalculationResult', () => {
    it('Should convert a valid result', () => {
      const resultMock: Partial<BearinxOnlineResult> = {
        subordinates: [
          {
            titleID: 'STRING_OUTP_RESULTS',
            identifier: 'block',
            subordinates: [
              {
                titleID: 'STRING_OUTP_BEARING_BEHAVIOUR',
                identifier: 'variableBlock',
                subordinates: [
                  {
                    abbreviation: 'Lh10',
                    identifier: 'variableLine',
                    subordinates: [],
                    value: '123.45',
                    unit: 'h',
                  },
                ],
              },
            ],
          },
        ],
      };

      const expectedResult: CatalogCalculationResult = {
        lh10: { value: '123.45', unit: 'h' },
      };

      expect(
        convertCatalogCalculationResult(resultMock as BearinxOnlineResult)
      ).toEqual(expectedResult);
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
