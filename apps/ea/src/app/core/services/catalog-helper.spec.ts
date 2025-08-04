import {
  API_RESULT_MOCK,
  API_RESULT_MULTIPLE_LOADCASES_MOCK,
  EXPECTED_RESULT_MULTIPLE_LOADCASES,
} from '@ea/testing/mocks/catalog-helper-mocks';
import { TranslocoModule } from '@jsverse/transloco';

import {
  LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY,
  LOADCASE_NAME_FIELD_NAME_TRANSLATION_KEY,
  LoadcaseValueType,
} from './bearinx-result.constant';
import { BearinxOnlineResult } from './bearinx-result.interface';
import {
  convertCatalogCalculationResult,
  convertTemplateResult,
} from './catalog-helper';

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

    it('Should convert a valid slewing bearing result', () => {
      const slewingBearingMock: Partial<BearinxOnlineResult> = {
        subordinates: [
          {
            titleID: 'STRING_OUTP_RESULTS',
            identifier: 'block',
            subordinates: [
              {
                titleID: 'STRING_OUTP_BEARING',
                identifier: 'variableBlock',
                subordinates: [
                  {
                    abbreviation: 'Lh10',
                    identifier: 'variableLine',
                    subordinates: [],
                    value: '64300',
                    unit: 'h',
                  },
                  {
                    abbreviation: 'Mr_max',
                    identifier: 'variableLine',
                    subordinates: [],
                    value: '31',
                    unit: 'N m',
                  },
                ],
              },
              {
                identifier: 'variableBlock',
                title: 'Load Case 1',
                subordinates: [
                  {
                    abbreviation: 'n',
                    identifier: 'variableLine',
                    subordinates: [],
                    value: '1',
                    unit: '1/min',
                  },
                  {
                    abbreviation: 'Mr',
                    identifier: 'variableLine',
                    subordinates: [],
                    value: '15.5',
                    unit: 'N m',
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = convertCatalogCalculationResult(
        slewingBearingMock as BearinxOnlineResult,
        undefined,
        false,
        true // isSlewing = true
      );

      expect(result.bearingBehaviour).toBeDefined();
      expect(result.maximumFrictionalTorque).toEqual({
        value: '31',
        unit: 'N m',
      });
      expect(
        (result as any)[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS]
      ).toBeDefined();
      expect((result as any)[LoadcaseValueType.FRICTION]).toBeDefined();
    });

    it('Should handle missing bearing behaviour for slewing bearings', () => {
      const result = convertCatalogCalculationResult(
        { subordinates: [] } as BearinxOnlineResult,
        undefined,
        false,
        true // isSlewing = true
      );

      expect(result.bearingBehaviour).toBeUndefined();
    });

    it('Should handle empty calculation error', () => {
      const result = convertCatalogCalculationResult(
        { subordinates: [] } as BearinxOnlineResult,
        undefined, // No calculation error
        false
      );

      expect(result.calculationError).toBeUndefined();
      expect(result.bearingBehaviour).toBeUndefined();
    });
  });

  describe('convertTemplateResult', () => {
    it('Should handle convertTemplateResult function existence', () => {
      // Basic test to ensure the function is exported and callable
      expect(typeof convertTemplateResult).toBe('function');
    });
  });
});
