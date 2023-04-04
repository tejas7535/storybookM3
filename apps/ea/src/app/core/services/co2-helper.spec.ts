import {
  convertCO2ApiResult,
  extractSubordinatesFromPath,
  matchItem,
} from './co2-helper';
import {
  CO2ServiceCalculationResult,
  ResultSubordinate,
} from './co2-service.interface';

describe('CO2 Helper', () => {
  describe('matchItem', () => {
    it('should match a correct item correctly', () => {
      const item: ResultSubordinate = {
        identifier: 'abc',
        subordinates: [],
        title: 'title',
      };

      expect(matchItem(item, { identifier: 'abc' })).toBe(true);
      expect(matchItem(item, { identifier: 'abc', title: 'title' })).toBe(true);
      expect(
        matchItem(
          { ...item, titleID: 'my-id' },
          { identifier: 'abc', title: 'title', titleID: 'my-id' }
        )
      ).toBe(true);
    });

    it('should not match an incorrect item', () => {
      const item: ResultSubordinate = {
        identifier: 'abc',
        subordinates: [],
        title: 'title',
      };

      expect(matchItem(item, { identifier: 'abcd' })).toBe(false);
      expect(matchItem(item, { identifier: 'abc', title: 'title-2' })).toBe(
        false
      );
      expect(
        matchItem(
          { ...item, titleID: 'my-id' },
          { identifier: 'abc', title: 'title', titleID: 'my-id-2' }
        )
      ).toBe(false);
    });
  });

  describe('extractSubordinatesFromPath', () => {
    const needle: ResultSubordinate = {
      identifier: 'abc',
      subordinates: [],
      title: 'my-title',
    };
    const input: CO2ServiceCalculationResult = {
      subordinates: [
        { identifier: 'sub', subordinates: [needle], title: 'sub-title' },
      ],
    } as CO2ServiceCalculationResult;

    it('returns the correct subordinate', () => {
      expect(
        extractSubordinatesFromPath(input, [
          { identifier: 'sub' },
          { identifier: 'abc' },
        ])
      ).toEqual(needle);
      expect(
        extractSubordinatesFromPath(input, [
          { title: 'sub-title' },
          { title: 'my-title' },
        ])
      ).toEqual(needle);
    });

    it('handles invalid paths gracefully', () => {
      expect(
        extractSubordinatesFromPath(input, [
          { identifier: 'sub-no' },
          { identifier: 'abc' },
        ])
      ).toBeUndefined();
    });
  });

  describe('convertCO2ApiResult', () => {
    it('Should convert a valid result', () => {
      const resultMock: Partial<CO2ServiceCalculationResult> = {
        subordinates: [
          {
            titleID: 'STRING_OUTP_RESULTS',
            identifier: 'block',
            subordinates: [
              {
                titleID: 'STRING_OUTP_CO2',
                identifier: 'block',
                subordinates: [
                  {
                    titleID: 'STRING_OUTP_CO2_EMISSIONS',
                    identifier: 'variableBlock',
                    subordinates: [
                      {
                        identifier: 'variableLine',
                        designation: 'CO2-emission',
                        subordinates: [],
                        value: '123.45',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(
        convertCO2ApiResult(resultMock as CO2ServiceCalculationResult)
      ).toEqual({ co2_downstream: 123.45 });
    });

    it('Should gracefully handle an invalid result', () => {
      const resultMock: Partial<CO2ServiceCalculationResult> = {
        subordinates: [
          {
            titleID: 'STRING_OUTP_RESULTS_INVALID',
            identifier: 'block',
            subordinates: [],
          },
        ],
      };

      expect(
        convertCO2ApiResult(resultMock as CO2ServiceCalculationResult)
      ).toEqual({});
    });
  });
});
