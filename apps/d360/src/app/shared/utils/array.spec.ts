import { deduplicateArray } from './array';

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

  it('handles mixed duplicate patterns', () => {
    expect(deduplicateArray(['a', 'b', 'c', 'a', 'd', 'b', 'e'])).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
    ]);
    expect(deduplicateArray(['a', 'a', 'b', 'b', 'c', 'c'])).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('preserves original order after deduplication', () => {
    expect(deduplicateArray(['c', 'a', 'b', 'c', 'b', 'a'])).toEqual([
      'c',
      'a',
      'b',
    ]);
  });

  it('works with longer arrays', () => {
    const longArray = Array.from({ length: 100 }).fill('a') as any;
    expect(deduplicateArray(longArray)).toEqual(['a']);

    const longMixedArray = Array.from({ length: 100 }, (_, i) =>
      // eslint-disable-next-line unicorn/no-nested-ternary
      i % 3 === 0 ? 'a' : i % 3 === 1 ? 'b' : 'c'
    );
    expect(deduplicateArray(longMixedArray)).toEqual(['a', 'b', 'c']);
  });

  it('handles special characters and whitespace', () => {
    expect(deduplicateArray(['a', ' ', 'a', ' '])).toEqual(['a', ' ']);
    expect(deduplicateArray(['!@#', '$%^', '!@#'])).toEqual(['!@#', '$%^']);
  });
});
