import { addArrayItem, arrayEquals, removeArrayItem } from './arrays';

let array1: string[];
let array2: string[];

describe('arrays', () => {
  describe('arrayEquals', () => {
    let checkEqualityResult: boolean;

    beforeEach(() => {
      array1 = undefined;
      array2 = undefined;

      checkEqualityResult = undefined;
    });

    it('should return false when arrays have different lengths', () => {
      array1 = ['foo', 'bar'];
      array2 = ['foo'];

      checkEqualityResult = arrayEquals(array1, array2);

      expect(checkEqualityResult).toBe(false);
    });

    it('should return false when length is equal but items differ', () => {
      array1 = ['foo', 'bar'];
      array2 = ['foo', 'baz'];

      checkEqualityResult = arrayEquals(array1, array2);

      expect(checkEqualityResult).toBe(false);
    });

    it('should return false when at least one of the arrays is not defined', () => {
      array1 = ['foo', 'bar'];
      array2 = undefined;

      checkEqualityResult = arrayEquals(array1, array2);

      expect(checkEqualityResult).toBe(false);
    });

    it('should return true when arrays have exact the same items', () => {
      array1 = ['foo', 'bar'];
      array2 = ['foo', 'bar'];

      checkEqualityResult = arrayEquals(array1, array2);

      expect(checkEqualityResult).toBe(true);
    });
  });

  describe('addArrayItem', () => {
    let arrayItem: string;

    beforeEach(() => {
      array1 = undefined;
      array2 = undefined;
      arrayItem = undefined;
    });

    it('should return original array if params are not present', () => {
      array1 = ['foo', 'bar'];

      expect(addArrayItem(array1, arrayItem)).toEqual(array1);
    });

    it('should not add item if already present', () => {
      array1 = ['foo', 'bar'];
      arrayItem = 'foo';
      array2 = addArrayItem(array1, arrayItem);

      expect(array1).toEqual(array2);
    });

    it('should add item if not already present', () => {
      array1 = ['foo'];
      arrayItem = 'bar';
      array2 = [...array1, arrayItem];

      expect(addArrayItem(array1, arrayItem)).toEqual(array2);
    });
  });

  describe('removeArrayItem', () => {
    let arrayItem: string;

    beforeEach(() => {
      array1 = undefined;
      array2 = undefined;
      arrayItem = undefined;
    });

    it('should return original array if params are not present', () => {
      array1 = ['foo', 'bar'];

      expect(removeArrayItem(array1, arrayItem)).toEqual(array1);
    });

    it('should return original array if item not present', () => {
      array1 = ['bar'];
      arrayItem = 'foo';
      array2 = removeArrayItem(array1, arrayItem);

      expect(array1).toEqual(array2);
    });

    it('should remove item if present', () => {
      array1 = ['foo', 'bar'];
      arrayItem = 'bar';
      array2 = ['foo'];

      expect(removeArrayItem(array1, arrayItem)).toEqual(array2);
    });
  });
});
