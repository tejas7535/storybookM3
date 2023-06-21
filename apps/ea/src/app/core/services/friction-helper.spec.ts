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
        ],
      };

      const expectedResult: FrictionCalculationResult = {
        co2_downstream: { value: 123.45, unit: 'kg' },
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
      ).toEqual({});
    });
  });
});
