import { countComparator } from '.';

describe('countComparator', () => {
  test('should return 1 when previous value bigger than next', () => {
    const previous = { count: 5 };
    const next = { count: 3 };

    const result = countComparator(previous, next);

    expect(result).toBe(1);
  });

  test('should return -1 when previous value smaller than next', () => {
    const previous = { count: 5 };
    const next = { count: 8 };

    const result = countComparator(previous, next);

    expect(result).toBe(-1);
  });

  test('should return 0 when previous value equal next', () => {
    const previous = { count: 8 };
    const next = { count: 8 };

    const result = countComparator(previous, next);

    expect(result).toBe(0);
  });
});
