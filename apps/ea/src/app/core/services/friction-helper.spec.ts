import { FILTER_INPUT_FIELDS_MOCK } from '@ea/testing/mocks/friction-api-result-mock';

import { FrictionCalculationResult } from '../store/models';
import { BearinxOnlineResult } from './bearinx-result.interface';
import { convertFrictionApiResult } from './friction-helper';

describe('CO2 Helper', () => {
  describe('convertFrictionApiResult', () => {
    it('Should convert a valid result', () => {
      const resultMock: Partial<BearinxOnlineResult> = {
        subordinates: [
          {
            titleID: 'STRING_OUTP_RESULTS',
            identifier: 'block',
            subordinates: [
              {
                titleID: 'STRING_OUTP_CO2E',
                identifier: 'block',
                subordinates: [
                  {
                    titleID: 'STRING_OUTP_CO2E_CALCULATION',
                    identifier: 'variableBlock',
                    subordinates: [
                      {
                        identifier: 'variableLine',
                        designation: 'CO2-emission',
                        subordinates: [],
                        value: '123.45',
                        unit: 'kg',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            identifier: 'block',
            subordinates: [
              {
                designation: 'Designation',
                identifier: 'variableLine',
                value: '6210',
                titleID: 'STRING_OUTP_CO2E',
                abbreviation: 'Test',
                unit: 'N',
                title: 'Series',
              },
              {
                designation: 'Series',
                identifier: 'variableLine',
                value: '5510',
                titleID: 'STRING_OUTP_CO2E',
                abbreviation: 'Test',
                unit: 'N',
                title: 'Series',
              },
            ],
            title: 'Input',
            titleID: 'STRING_OUTP_INPUT',
          },
          {
            identifier: 'block',
            title: 'Error title',
            subordinates: [],
          },
          {
            identifier: 'block',
            title: 'Warning title',
            subordinates: [],
          },
        ],
      };

      const expectedResult: FrictionCalculationResult = {
        co2_downstream: { value: 123.45, unit: 'kg' },
        reportInputSuborinates: {
          inputSubordinates: [
            {
              designation: 'Designation',
              hasNestedStructure: false,
              value: '6210',
              unit: 'N',
              abbreviation: 'Test',
              title: 'Series',
              titleID: 'STRING_OUTP_CO2E',
            },
            {
              designation: 'Series',
              hasNestedStructure: false,
              value: '5510',
              unit: 'N',
              abbreviation: 'Test',
              title: 'Series',
              titleID: 'STRING_OUTP_CO2E',
            },
          ],
        },
        reportMessages: {
          messages: [
            {
              title: 'Error title',
              item: {
                subItems: [],
              },
            },
            {
              title: 'Warning title',
              item: {
                subItems: [],
              },
            },
          ],
        },
      };

      expect(
        convertFrictionApiResult(resultMock as BearinxOnlineResult)
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
        convertFrictionApiResult(resultMock as BearinxOnlineResult)
      ).toEqual({
        reportMessages: {
          messages: [],
        },
      });
    });

    it('Should ignore input fields that are meant to be hidden', () => {
      const mockResult = FILTER_INPUT_FIELDS_MOCK.apiResponse;
      const expectedResult = FILTER_INPUT_FIELDS_MOCK.expectedResult;

      const result = convertFrictionApiResult(
        mockResult as BearinxOnlineResult
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
