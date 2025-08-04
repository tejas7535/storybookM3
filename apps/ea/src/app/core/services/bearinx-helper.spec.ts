import { TranslocoModule } from '@jsverse/transloco';

import {
  extractErrorsFromResult,
  extractErrorsWarningsAndNotesFromResult,
  extractNotesFromResult,
  extractSubordinatesFromPath,
  extractTableFromSubordinate,
  extractValues,
  extractWarningsFromResult,
  formatMessageSubordinates,
  matchItem,
} from './bearinx-helper';
import {
  LoadcaseValueType,
  STRING_ERROR_BLOCK,
  STRING_NOTE_BLOCK,
  STRING_WARNING_BLOCK,
  TABLE,
  VARIABLE_BLOCK,
} from './bearinx-result.constant';
import {
  BearinxOnlineResult,
  BearinxOnlineResultSubordinate,
} from './bearinx-result.interface';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('Bearinx Helper', () => {
  describe('matchItem', () => {
    it('should match a correct item correctly', () => {
      const item: BearinxOnlineResultSubordinate = {
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
      const item: BearinxOnlineResultSubordinate = {
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
    const needle: BearinxOnlineResultSubordinate = {
      identifier: 'abc',
      subordinates: [],
      title: 'my-title',
    };
    const input: BearinxOnlineResult = {
      subordinates: [
        { identifier: 'sub', subordinates: [needle], title: 'sub-title' },
      ],
    } as BearinxOnlineResult;

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

  describe('extractTableFromSubordinate', () => {
    it('extracts data from a table', () => {
      const input: Partial<BearinxOnlineResultSubordinate> = {
        data: {
          fields: [],
          unitFields: [],
          items: [
            [
              { field: 'abc', unit: 'm', value: '1' },
              { field: 'def', unit: 'm', value: '2' },
              { field: 'resultValues.loadcase', value: 'loadcase' },
            ],
          ],
        },
      };

      expect(extractTableFromSubordinate(input)).toEqual([
        {
          abc: {
            unit: 'm',
            value: '1',
            short: 'abc',
            loadcaseName: 'loadcase',
          },
          def: {
            unit: 'm',
            value: '2',
            short: 'def',
            loadcaseName: 'loadcase',
          },
        },
      ]);
    });

    it('handles an empty input gracefully', () => {
      expect(extractTableFromSubordinate({})).toBeUndefined();
    });
  });

  describe('extractErrorsWarningsAndNotesFromResult', () => {
    let item: BearinxOnlineResultSubordinate;
    describe('when report messages are provided', () => {
      it('should extract report messages data', () => {
        item = {
          identifier: 'abc',
          subordinates: [
            {
              title: 'some title',
              identifier: 'block',
            },
          ],
        };
        expect(extractErrorsWarningsAndNotesFromResult(item)).toEqual([
          { title: 'some title', identifier: 'block' },
        ]);
      });
    });

    describe('when report messages are not provided', () => {
      it('should return empty collection', () => {
        item = {
          identifier: 'abc',
          subordinates: [
            {
              title: 'some title',
              identifier: 'block',
              titleID: 'some other result',
            },
          ],
        };
        expect(extractErrorsWarningsAndNotesFromResult(item)).toEqual([]);
      });
    });
  });

  describe('when getting errors, warnings and notes', () => {
    let items: BearinxOnlineResultSubordinate[];
    let result: BearinxOnlineResultSubordinate;

    beforeAll(() => {
      items = [
        {
          identifier: 'block',
          title: 'Warnings',
          titleID: STRING_WARNING_BLOCK,
          subordinates: [
            {
              text: ['some text'],
              identifier: 'text',
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Errors',
          titleID: STRING_ERROR_BLOCK,
          subordinates: [
            {
              text: ['main error'],
              identifier: 'text',
            },
            {
              identifier: 'block',
              subordinates: [
                {
                  text: ['nested error 1'],
                  identifier: 'text',
                },
                {
                  text: [
                    'nested error 2',
                    'nested error 2.1',
                    'nested error 2.2',
                  ],
                  identifier: 'text',
                },
                {
                  text: ['nested error 3'],
                  identifier: 'text',
                },
              ],
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Notes',
          titleID: STRING_NOTE_BLOCK,
          subordinates: [
            {
              text: ['some note'],
              identifier: 'text',
            },
            {
              identifier: 'block',
              subordinates: [
                {
                  text: ['note'],
                  identifier: 'text',
                },
                {
                  text: ['nested note 1', '    ', 'nested note 2', '    '],
                  identifier: 'text',
                },
                {
                  text: ['nested note 3'],
                  identifier: 'text',
                },
              ],
            },
          ],
        },
      ];

      result = {
        identifier: 'outputDescription',
        subordinates: items,
      };
    });

    describe('when getting errors from result', () => {
      let errors: BearinxOnlineResultSubordinate[];
      beforeAll(() => {
        errors = extractErrorsFromResult(result);
      });

      it('should extract errors', () => {
        expect(errors).toEqual([items[1]]);
      });

      describe('when formatting errors', () => {
        it('should format it', () => {
          expect(formatMessageSubordinates(errors)).toMatchSnapshot();
        });
      });
    });

    describe('when getting warnings from result', () => {
      let warnings: BearinxOnlineResultSubordinate[];
      beforeAll(() => {
        warnings = extractWarningsFromResult(result);
      });

      it('should extract warnings', () => {
        expect(warnings).toEqual([items[0]]);
      });

      describe('when formatting warnings', () => {
        it('should format it', () => {
          expect(formatMessageSubordinates(warnings)).toMatchSnapshot();
        });
      });
    });

    describe('when getting notes from result', () => {
      let notes: BearinxOnlineResultSubordinate[];
      beforeAll(() => {
        notes = extractNotesFromResult(result);
      });

      it('should extract notes', () => {
        expect(notes).toEqual([items[2]]);
      });

      describe('when formatting notes', () => {
        it('should format it', () => {
          expect(formatMessageSubordinates(notes)).toMatchSnapshot();
        });
      });
    });
  });

  describe('extractValues', () => {
    describe('when extracting from VARIABLE_BLOCK', () => {
      it('should extract values without parsing for non-numeric loadcase types', () => {
        const subordinate: BearinxOnlineResultSubordinate = {
          identifier: VARIABLE_BLOCK,
          subordinates: [
            {
              abbreviation: 'testAbbr',
              value: '123.45',
              unit: 'mm',
              identifier: 'variableLine',
              subordinates: [],
            },
          ],
        };

        const result: any = {};
        const values = { testKey: 'testAbbr' };

        // Use a mock loadcase type that's not in the numeric types
        const mockLoadcaseType = 'mockNonNumericType' as LoadcaseValueType;
        extractValues(result, subordinate, values, mockLoadcaseType);

        expect(result[mockLoadcaseType]).toHaveLength(1);
        expect(result[mockLoadcaseType][0].testKey).toEqual({
          value: '123.45', // Should remain as string
          unit: 'mm',
          short: 'testAbbr',
          title: 'testKey',
          loadcaseName: '',
        });
      });

      it('should extract values with parsing for numeric loadcase types', () => {
        const subordinate: BearinxOnlineResultSubordinate = {
          identifier: VARIABLE_BLOCK,
          subordinates: [
            {
              abbreviation: 'numericAbbr',
              value: '45.67',
              unit: 'N',
              identifier: 'variableLine',
              subordinates: [],
            },
            {
              abbreviation: 'nonNumericAbbr',
              value: '> 1000000',
              unit: 'h',
              identifier: 'variableLine',
              subordinates: [],
            },
          ],
        };

        const result: any = {};
        const values = {
          numericValue: 'numericAbbr',
          nonNumericValue: 'nonNumericAbbr',
        };

        extractValues(
          result,
          subordinate,
          values,
          LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS
        );

        expect(
          result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS]
        ).toHaveLength(1);
        const extractedData =
          result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS][0];

        expect(extractedData.numericValue.value).toBe(45.67); // Should be parsed as number
        expect(extractedData.nonNumericValue.value).toBe('> 1000000'); // Should remain as string
      });

      it('should handle missing subordinates gracefully', () => {
        const subordinate: BearinxOnlineResultSubordinate = {
          identifier: VARIABLE_BLOCK,
          subordinates: [],
        };

        const result: any = {};
        const values = { missingKey: 'missingAbbr' };

        extractValues(result, subordinate, values, LoadcaseValueType.FRICTION);

        expect(result[LoadcaseValueType.FRICTION]).toHaveLength(1);
        expect(result[LoadcaseValueType.FRICTION][0]).toEqual({});
      });
    });

    describe('when extracting from TABLE', () => {
      it('should extract table values with correct parsing', () => {
        const subordinate: BearinxOnlineResultSubordinate = {
          identifier: TABLE,
          data: {
            fields: [],
            unitFields: [],
            items: [
              [
                { field: 'testField1', unit: 'mm', value: '123.45' },
                { field: 'testField2', unit: 'N', value: 'invalid' },
                { field: 'resultValues.loadcase', value: 'Load case 1' },
              ],
              [
                { field: 'testField1', unit: 'mm', value: '67.89' },
                { field: 'testField2', unit: 'N', value: '999.99' },
                { field: 'resultValues.loadcase', value: 'Load case 2' },
              ],
            ],
          },
        };

        const result: any = {};
        const values = {
          field1: 'testField1',
          field2: 'testField2',
        };

        extractValues(
          result,
          subordinate,
          values,
          LoadcaseValueType.LUBRICATION
        );

        expect(result[LoadcaseValueType.LUBRICATION]).toHaveLength(2);

        // First row
        expect(result[LoadcaseValueType.LUBRICATION][0].field1).toEqual({
          value: 123.45, // Parsed as number
          unit: 'mm',
          short: 'testField1',
          loadcaseName: 'Load case 1',
          title: 'field1',
        });

        expect(result[LoadcaseValueType.LUBRICATION][0].field2).toEqual({
          value: 'invalid', // Remains as string (invalid number)
          unit: 'N',
          short: 'testField2',
          loadcaseName: 'Load case 1',
          title: 'field2',
        });

        // Second row
        expect(result[LoadcaseValueType.LUBRICATION][1].field1.value).toBe(
          67.89
        );
        expect(result[LoadcaseValueType.LUBRICATION][1].field2.value).toBe(
          999.99
        );
      });

      it('should filter out missing fields in table rows', () => {
        const subordinate: BearinxOnlineResultSubordinate = {
          identifier: TABLE,
          data: {
            fields: [],
            unitFields: [],
            items: [
              [
                { field: 'existingField', unit: 'mm', value: '123' },
                { field: 'resultValues.loadcase', value: 'Load case 1' },
              ],
            ],
          },
        };

        const result: any = {};
        const values = {
          existing: 'existingField',
          missing: 'missingField',
        };

        extractValues(result, subordinate, values, LoadcaseValueType.FRICTION);

        expect(result[LoadcaseValueType.FRICTION]).toHaveLength(1);
        expect(result[LoadcaseValueType.FRICTION][0]).toHaveProperty(
          'existing'
        );
        expect(result[LoadcaseValueType.FRICTION][0]).not.toHaveProperty(
          'missing'
        );
      });

      it('should handle empty table data', () => {
        const subordinate: BearinxOnlineResultSubordinate = {
          identifier: TABLE,
          data: {
            fields: [],
            unitFields: [],
            items: [],
          },
        };

        const result: any = {};
        const values = { field1: 'testField' };

        extractValues(result, subordinate, values, LoadcaseValueType.FRICTION);

        expect(result[LoadcaseValueType.FRICTION]).toHaveLength(0);
      });
    });

    describe('edge cases', () => {
      it('should handle unknown subordinate identifier gracefully', () => {
        const subordinate: BearinxOnlineResultSubordinate = {
          identifier: 'unknown' as any,
          subordinates: [],
        };

        const _result: any = {};
        const values = { testKey: 'testAbbr' };

        extractValues(_result, subordinate, values, LoadcaseValueType.FRICTION);

        expect(_result[LoadcaseValueType.FRICTION]).toBeUndefined();
      });

      it('should handle all numeric loadcase types correctly', () => {
        const subordinate: BearinxOnlineResultSubordinate = {
          identifier: VARIABLE_BLOCK,
          subordinates: [
            {
              abbreviation: 'test',
              value: '42.5',
              unit: 'unit',
              identifier: 'variableLine',
              subordinates: [],
            },
          ],
        };

        const values = { test: 'test' };

        // Test all numeric types
        const numericTypes = [
          LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS,
          LoadcaseValueType.LUBRICATION,
          LoadcaseValueType.FRICTION,
        ];

        numericTypes.forEach((type) => {
          const testResult: any = {};
          extractValues(testResult, subordinate, values, type);
          expect(testResult[type][0].test.value).toBe(42.5);
        });

        // Test non-numeric type with mock
        const nonNumericResult: any = {};
        const mockNonNumericType = 'mockNonNumericType' as LoadcaseValueType;
        extractValues(
          nonNumericResult,
          subordinate,
          values,
          mockNonNumericType
        );
        expect(nonNumericResult[mockNonNumericType][0].test.value).toBe('42.5');
      });
    });
  });
});
