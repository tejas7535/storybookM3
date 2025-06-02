import {
  SelectableValue,
  SelectableValueUtils,
} from './selectable-values.utils';

describe('SelectableValueUtils', () => {
  describe('isSelectableValue', () => {
    it('should return true for a valid SelectableValue object', () => {
      const value: SelectableValue = { id: '1', text: 'Test' };
      expect(SelectableValueUtils.isSelectableValue(value)).toBe(true);
    });

    it('should return false for null', () => {
      expect(SelectableValueUtils.isSelectableValue(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(SelectableValueUtils.isSelectableValue(undefined as any)).toBe(
        false
      );
    });

    it('should return false for a string', () => {
      expect(SelectableValueUtils.isSelectableValue('test')).toBe(false);
    });

    it('should return false for an incomplete SelectableValue object', () => {
      expect(SelectableValueUtils.isSelectableValue({ id: '1' })).toBe(false);
      expect(SelectableValueUtils.isSelectableValue({ text: 'Test' })).toBe(
        false
      );
    });
  });

  describe('mapToOptionsIfPossible', () => {
    const options: SelectableValue[] = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
      { id: '3', text: 'Option 3' },
    ];

    it('should map string values to SelectableValues from available options', () => {
      const initialValues = ['1', '2'];
      const result = SelectableValueUtils.mapToOptionsIfPossible(
        initialValues,
        options
      );
      expect(result).toEqual([
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ]);
    });

    it('should handle SelectableValue array as initialValues', () => {
      const initialValues: SelectableValue[] = [
        { id: '1', text: 'Test 1' },
        { id: '3', text: 'Test 3' },
      ];
      const result = SelectableValueUtils.mapToOptionsIfPossible(
        initialValues,
        options
      );
      expect(result).toEqual(initialValues);
    });

    it('should return empty array if initialValues is undefined', () => {
      const result = SelectableValueUtils.mapToOptionsIfPossible(
        undefined,
        options
      );
      expect(result).toEqual([]);
    });

    it('should return empty array if options is undefined', () => {
      const initialValues = ['1', '2'];
      const result = SelectableValueUtils.mapToOptionsIfPossible(
        initialValues,
        undefined as any
      );
      expect(result).toEqual([]);
    });

    it('should filter out null results', () => {
      const initialValues = ['1', '999']; // '999' doesn't exist in options
      const result = SelectableValueUtils.mapToOptionsIfPossible(
        initialValues,
        options
      );
      expect(result).toEqual([{ id: '1', text: 'Option 1' }]);
    });
  });

  describe('matchOptionIfPossible', () => {
    const options: SelectableValue[] = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
      { id: '3', text: 'Option 3' },
    ];

    it('should return a matching option for a string value', () => {
      const result = SelectableValueUtils.matchOptionIfPossible('1', options);
      expect(result).toEqual({ id: '1', text: 'Option 1' });
    });

    it('should return null if no match found', () => {
      const result = SelectableValueUtils.matchOptionIfPossible('999', options);
      expect(result).toBeNull();
    });

    it('should return the same SelectableValue if it is already complete', () => {
      const value: SelectableValue = { id: '4', text: 'Option 4' };
      const result = SelectableValueUtils.matchOptionIfPossible(value, options);
      expect(result).toEqual(value);
    });

    it('should try to find a better version if id equals text', () => {
      const value: SelectableValue = { id: '1', text: '1' };
      const result = SelectableValueUtils.matchOptionIfPossible(value, options);
      expect(result).toEqual({ id: '1', text: 'Option 1' });
    });

    it('should return null for null input', () => {
      expect(
        SelectableValueUtils.matchOptionIfPossible(null, options)
      ).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(
        SelectableValueUtils.matchOptionIfPossible(undefined, options)
      ).toBeNull();
    });

    it('should create a SelectableValue for string input when options are undefined', () => {
      const result = SelectableValueUtils.matchOptionIfPossible(
        'test',
        undefined as any
      );
      expect(result).toEqual({ id: 'test', text: 'test' });
    });

    it('should handle partial SelectableValue', () => {
      const result = SelectableValueUtils.matchOptionIfPossible(
        { id: '2' },
        options
      );
      expect(result).toEqual({ id: '2', text: 'Option 2' });
    });
  });

  describe('toSelectableValueOrNull', () => {
    it('should convert a string to a SelectableValue', () => {
      const result = SelectableValueUtils.toSelectableValueOrNull(
        'test',
        false
      );
      expect(result).toEqual({ id: 'test', text: 'test' });
    });

    it('should convert a string array to a SelectableValue array when shouldBeArray is true', () => {
      const result = SelectableValueUtils.toSelectableValueOrNull(
        ['test1', 'test2'],
        true
      );
      expect(result).toEqual([
        { id: 'test1', text: 'test1' },
        { id: 'test2', text: 'test2' },
      ]);
    });

    it('should handle null value with shouldBeArray=false', () => {
      const result = SelectableValueUtils.toSelectableValueOrNull(null, false);
      expect(result).toBeNull();
    });

    it('should handle null value with shouldBeArray=true', () => {
      const result = SelectableValueUtils.toSelectableValueOrNull(null, true);
      expect(result).toEqual([]);
    });

    it('should handle empty string with shouldBeArray=false', () => {
      const result = SelectableValueUtils.toSelectableValueOrNull('', false);
      expect(result).toBeNull();
    });

    it('should handle empty string with shouldBeArray=true', () => {
      const result = SelectableValueUtils.toSelectableValueOrNull('', true);
      expect(result).toEqual([]);
    });

    it('should handle a complete SelectableValue', () => {
      const value: SelectableValue = { id: '1', text: 'Option 1' };
      const result = SelectableValueUtils.toSelectableValueOrNull(value, false);
      expect(result).toEqual(value);
    });

    it('should handle a partial SelectableValue', () => {
      const value = { id: '1' };
      const result = SelectableValueUtils.toSelectableValueOrNull(value, false);
      expect(result).toEqual({ id: '1', text: '' });
    });

    it('should handle an array of SelectableValues when shouldBeArray is false', () => {
      const values: SelectableValue[] = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      const result = SelectableValueUtils.toSelectableValueOrNull(
        values,
        false
      );
      expect(result).toEqual({ id: '1', text: 'Option 1' });
    });

    it('should handle boolean values', () => {
      // The implementation seems to handle boolean values by returning an empty SelectableValue
      const result = SelectableValueUtils.toSelectableValueOrNull(
        true as any,
        false
      );
      expect(result).toEqual({ id: '', text: '' });
    });
  });
});
