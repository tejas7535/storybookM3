import { SelectableValue } from '../../components/inputs/autocomplete/selectable-values.utils';
import * as Parser from '../parse-values';
import {
  isEqual,
  validateDemandCharacteristicType,
  validateReplacementType,
  validateSelectableOptions,
} from './data-validation';

describe('DataValidations', () => {
  describe('isEqual', () => {
    it('should return true for primitive values that are equal', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('test', 'test')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
    });

    it('should return false for primitive values that are not equal', () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual('test', 'different')).toBe(false);
      expect(isEqual(true, false)).toBe(false);
    });

    it('should return true for functions', () => {
      const func1 = () => {};
      const func2 = () => {};
      expect(isEqual(func1, func2)).toBe(true);
    });

    it('should return true for arrays with the same elements in the same order', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('should return false for arrays with different elements', () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it('should return false for arrays with the same elements in a different order', () => {
      expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });

    it('should return false for arrays with different element counts', () => {
      expect(isEqual([1, 2], [3, 2, 1])).toBe(false);
    });

    it('should return true for objects with the same keys and values', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 2 };
      expect(isEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for objects with different keys or values', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      const obj3 = { a: 1, c: 2 };
      expect(isEqual(obj1, obj2)).toBe(false);
      expect(isEqual(obj1, obj3)).toBe(false);
    });

    it('should return false for objects with different numbers of keys', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1 };
      expect(isEqual(obj1, obj2)).toBe(false);
    });

    it('should return false for null and non-null values', () => {
      expect(isEqual(null, {})).toBe(false);
      expect(isEqual({}, null)).toBe(false);
    });

    it('should return false for arrays and objects', () => {
      expect(isEqual([], {})).toBe(false);
      expect(isEqual({}, [])).toBe(false);
    });

    it('should return true for deeply nested objects that are equal', () => {
      const obj1 = { a: { b: { c: 1 } } };
      const obj2 = { a: { b: { c: 1 } } };
      expect(isEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for deeply nested objects that are not equal', () => {
      const obj1 = { a: { b: { c: 1 } } };
      const obj2 = { a: { b: { c: 2 } } };
      expect(isEqual(obj1, obj2)).toBe(false);
    });
  });

  describe('isEqual with edge cases', () => {
    it('should handle undefined values correctly', () => {
      expect(isEqual(undefined as any, undefined as any)).toBe(true);
      expect(isEqual(undefined, null)).toBe(false);
      expect(isEqual(1, undefined as any)).toBe(false);
    });

    it('should handle null values correctly', () => {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(null, undefined as any)).toBe(false);
      expect(isEqual(0, null)).toBe(false);
    });

    it('should correctly compare nested arrays', () => {
      expect(
        isEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 4],
          ]
        )
      ).toBe(true);
      expect(
        isEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 5],
          ]
        )
      ).toBe(false);
      expect(
        isEqual(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [3, 4],
            [1, 2],
          ]
        )
      ).toBe(false);
    });

    it('should correctly compare objects containing arrays', () => {
      expect(isEqual({ arr: [1, 2, 3] }, { arr: [1, 2, 3] })).toBe(true);
      expect(isEqual({ arr: [1, 2, 3] }, { arr: [1, 2, 4] })).toBe(false);
    });

    it('should correctly compare arrays containing objects', () => {
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBe(false);
    });

    it('should handle empty objects and arrays', () => {
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual([], [])).toBe(true);
      expect(isEqual({}, [])).toBe(false);
    });
  });

  describe('validateSelectableOptions', () => {
    const mockOptions: SelectableValue[] = [
      { text: 'Option 1', id: '1' },
      { text: 'Option 2', id: '2' },
    ];

    it('should return undefined if the value matches an option', () => {
      const validate = validateSelectableOptions(mockOptions);
      const result = validate('Option 1');

      expect(result).toBeUndefined();
    });

    it('should return a validation error message if the value does not match any option', () => {
      const validate = validateSelectableOptions(mockOptions);
      const result = validate('Invalid Option');

      expect(result).toBe('generic.validation.check_inputs');
    });

    it('should handle non-breaking spaces in the value and options', () => {
      const validate = validateSelectableOptions(mockOptions);
      const result = validate('Option\u00A01');

      expect(result).toBeUndefined();
    });
  });

  describe('validateSelectableOptions additional tests', () => {
    const mockOptions: SelectableValue[] = [
      { text: 'Option 1', id: '1' },
      { text: 'Option 2', id: '2' },
      { text: 'Partial Match Option', id: '3' },
    ];

    it('should match partial text correctly', () => {
      const validate = validateSelectableOptions(mockOptions);
      expect(validate('Partial Match')).toBeUndefined();
    });

    it('should handle case sensitivity', () => {
      const validate = validateSelectableOptions(mockOptions);
      // Current implementation is case-sensitive
      expect(validate('option 1')).toBe('generic.validation.check_inputs');
    });

    it('should work with empty options array', () => {
      const validate = validateSelectableOptions([]);
      expect(validate('any value')).toBe('generic.validation.check_inputs');
    });

    it('should handle empty input string', () => {
      const validate = validateSelectableOptions(mockOptions);
      expect(validate('')).toBeUndefined();
    });
  });

  describe('validateReplacementType', () => {
    it('should return undefined if the value matches a replacement type', () => {
      jest
        .spyOn(Parser, 'parseToStringLiteralTypeIfPossible')
        .mockReturnValue('any value');

      const result = validateReplacementType('validType');

      expect(result).toBeUndefined();
    });

    it('should return a validation error message if the value does not match a replacement type', () => {
      jest
        .spyOn(Parser, 'parseToStringLiteralTypeIfPossible')
        .mockReturnValue(undefined as any);

      const result = validateReplacementType('invalidType');

      expect(result).toBe(
        'internal_material_replacement.error.check_replacement_type'
      );
    });
  });

  describe('validateDemandCharacteristicType', () => {
    it('should return undefined if the value matches a demand characteristic type', () => {
      jest
        .spyOn(Parser, 'parseToStringLiteralTypeIfPossible')
        .mockReturnValue('any value');

      const result = validateDemandCharacteristicType('validCharacteristic');

      expect(result).toBeUndefined();
    });

    it('should return a validation error message if the value does not match a demand characteristic type', () => {
      jest
        .spyOn(Parser, 'parseToStringLiteralTypeIfPossible')
        .mockReturnValue(undefined as any);

      const result = validateDemandCharacteristicType('invalidCharacteristic');

      expect(result).toBe('generic.validation.check_inputs');
    });

    it('should call parseToStringLiteralTypeIfPossible with correct parameters', () => {
      const spy = jest.spyOn(Parser, 'parseToStringLiteralTypeIfPossible');
      validateDemandCharacteristicType('testValue');

      expect(spy).toHaveBeenCalledWith(
        'testValue',
        expect.any(Array),
        expect.any(Function)
      );
    });
  });
});
