import { TranslocoModule } from '@jsverse/transloco';

import {
  extractErrorsFromResult,
  extractErrorsWarningsAndNotesFromResult,
  extractNotesFromResult,
  extractSubordinatesFromPath,
  extractTableFromSubordinate,
  extractWarningsFromResult,
  formatMessageSubordinates,
  matchItem,
} from './bearinx-helper';
import {
  STRING_ERROR_BLOCK,
  STRING_NOTE_BLOCK,
  STRING_WARNING_BLOCK,
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
});
