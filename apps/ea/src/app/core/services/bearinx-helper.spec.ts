import {
  extractErrorsWarningsAndNotesFromResult,
  extractSubordinatesFromPath,
  extractTableFromSubordinate,
  formatErrorsWarningsAndNotesResult,
  formatReportInputResult,
  matchItem,
} from './bearinx-helper';
import {
  BearinxOnlineResult,
  BearinxOnlineResultSubordinate,
} from './bearinx-result.interface';

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
            ],
          ],
        },
      };

      expect(extractTableFromSubordinate(input)).toEqual({
        abc: { unit: 'm', value: '1' },
        def: { unit: 'm', value: '2' },
      });
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

  describe('formatErrorsWarningsAndNotesResult', () => {
    let items: BearinxOnlineResultSubordinate[];

    describe('when report messages are provided', () => {
      it('should extract report messages data', () => {
        items = [
          {
            identifier: 'block',
            title: 'Warnings',
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
        ];

        expect(formatErrorsWarningsAndNotesResult(items)).toEqual([
          {
            title: 'Warnings',
            item: {
              subItems: [
                {
                  item: {
                    messages: ['some text'],
                  },
                },
              ],
            },
          },
          {
            title: 'Errors',
            item: {
              subItems: [
                {
                  item: {
                    messages: ['main error'],
                  },
                },
                {
                  item: {
                    subItems: [
                      {
                        item: {
                          messages: ['nested error 1'],
                        },
                      },
                      {
                        item: {
                          messages: [
                            'nested error 2',
                            'nested error 2.1',
                            'nested error 2.2',
                          ],
                        },
                      },
                      {
                        item: {
                          messages: ['nested error 3'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ]);
      });
    });
  });

  describe('formatReportInputResult', () => {
    let items: BearinxOnlineResultSubordinate[];
    it('should format report input result', () => {
      items = [
        {
          identifier: 'block',
          subordinates: [
            {
              identifier: 'block',
              subordinates: [
                {
                  identifier: 'table',
                  data: {
                    fields: ['apple', 'bannana', 'tomato'],
                    items: [
                      [
                        {
                          field: 'apple',
                          value: 'delicious apple',
                          unit: 'kg',
                        },
                        {
                          field: 'bannana',
                          value: 'delicious bannana',
                          unit: 'qt',
                        },
                        {
                          field: 'tomato',
                          value: 'some cherry tomatoes',
                        },
                      ],
                    ],
                    unitFields: [],
                  },
                },
              ],
              title: 'inner Block',
            },
            {
              identifier: 'variableBlock',
              title: 'title variable Block 1',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'reference rating life',
                  value: 'nominal',
                },
              ],
            },
          ],
          title: 'main block',
        },
      ];

      expect(formatReportInputResult(items)).toEqual([
        {
          hasNestedStructure: true,
          subItems: [
            {
              hasNestedStructure: true,
              subItems: [
                {
                  hasNestedStructure: false,
                  subItems: [
                    {
                      hasNestedStructure: false,
                      designation: 'apple',
                      value: 'delicious apple',
                      unit: 'kg',
                    },
                    {
                      hasNestedStructure: false,
                      designation: 'bannana',
                      value: 'delicious bannana',
                      unit: 'qt',
                    },
                    {
                      hasNestedStructure: false,
                      designation: 'tomato',
                      value: 'some cherry tomatoes',
                      unit: undefined,
                    },
                  ],
                  title: undefined,
                },
              ],
              title: 'inner Block',
            },
            {
              hasNestedStructure: false,
              title: 'title variable Block 1',
              subItems: [
                {
                  abbreviation: undefined,
                  hasNestedStructure: false,
                  designation: 'reference rating life',
                  value: 'nominal',
                  title: undefined,
                  unit: undefined,
                },
              ],
            },
          ],
          title: 'main block',
        },
      ]);
    });
  });
});
