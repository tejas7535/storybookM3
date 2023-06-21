import {
  extractSubordinatesFromPath,
  extractTableFromSubordinate,
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
});
