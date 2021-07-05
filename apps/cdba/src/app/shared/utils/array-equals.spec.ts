import { arrayEquals } from './array-equals';

describe('arrayEquals', () => {
  let array1;
  let array2;

  let result: boolean;

  beforeEach(() => {
    array1 = undefined;
    array2 = undefined;

    result = undefined;
  });
  it('should return false when arrays have different lengths', () => {
    array1 = ['foo', 'bar'];
    array2 = ['foo'];

    result = arrayEquals(array1, array2);

    expect(result).toBeFalsy();
  });

  it('should return false when length is equal but items differ', () => {
    array1 = ['foo', 'bar'];
    array2 = ['foo', 'baz'];

    result = arrayEquals(array1, array2);

    expect(result).toBeFalsy();
  });

  it('should return true when arrays have exact the same items', () => {
    array1 = ['foo', 'bar'];
    array2 = ['foo', 'bar'];

    result = arrayEquals(array1, array2);

    expect(result).toBeTruthy();
  });
});
