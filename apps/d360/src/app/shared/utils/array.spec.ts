import { deduplicateArray, emptyArrayToUndefined } from './array';

describe('emptyArrayToUndefined(…)', () => {
  it('keeps filled arrays', () => {
    const filledArray = ['foo'];
    expect(emptyArrayToUndefined(filledArray)).toEqual(filledArray);

    const filledArray2 = ['foo', 'bar'];
    expect(emptyArrayToUndefined(filledArray2)).toEqual(filledArray2);
  });

  it('returns undefined on empty arrays', () => {
    expect(emptyArrayToUndefined([])).toEqual(undefined);
  });

  it('returns undefined on arrays with empty content', () => {
    expect(emptyArrayToUndefined([''])).toEqual(undefined);
    expect(emptyArrayToUndefined(['', ''])).toEqual(undefined);
  });
});

describe('deduplicateArray(…)', () => {
  it('handles empty array', () => {
    expect(deduplicateArray([])).toEqual([]);
  });

  it('deduplicates', () => {
    expect(deduplicateArray(['a', 'a'])).toEqual(['a']);
    expect(deduplicateArray(['a', 'a', 'a'])).toEqual(['a']);
  });

  it('keeps first occurence', () => {
    expect(deduplicateArray(['a', 'b', 'a'])).toEqual(['a', 'b']);
    expect(deduplicateArray(['a', 'b', 'a', 'b'])).toEqual(['a', 'b']);
    expect(deduplicateArray(['b', 'a', 'b'])).toEqual(['b', 'a']);
  });
});
