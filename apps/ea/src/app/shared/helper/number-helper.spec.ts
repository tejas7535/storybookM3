import { extractNumber, roundToThreeSigFigs } from './number-helper';

describe('roundToThreeSigFigs', () => {
  test('should round large numbers to three significant figures', () => {
    expect(roundToThreeSigFigs(12_345_678)).toBe('12300000');
    expect(roundToThreeSigFigs(-12_345_678)).toBe('-12300000');
  });

  test('should round small numbers to three significant figures', () => {
    expect(roundToThreeSigFigs(0.000_123_456)).toBe('0.000123');
    expect(roundToThreeSigFigs(-0.000_123_456)).toBe('-0.000123');
  });

  test('should return the same number for numbers with three or fewer significant figures', () => {
    expect(roundToThreeSigFigs(123)).toBe('123');
    expect(roundToThreeSigFigs(-123)).toBe('-123');
    expect(roundToThreeSigFigs(0.123)).toBe('0.123');
    expect(roundToThreeSigFigs(-0.123)).toBe('-0.123');
  });

  test('should return zero for zero', () => {
    expect(roundToThreeSigFigs(0)).toBe('0');
  });

  test('should handle numbers close to but less than 1', () => {
    expect(roundToThreeSigFigs(0.9999)).toBe('1.00');
    expect(roundToThreeSigFigs(0.9994)).toBe('0.999');
    expect(roundToThreeSigFigs(-0.9999)).toBe('-1.00');
    expect(roundToThreeSigFigs(-0.9994)).toBe('-0.999');
    expect(roundToThreeSigFigs(1.332)).toBe('1.33');
  });
});

describe('extractFormattedNumber', () => {
  test('should handle formatting', () => {
    expect(extractNumber('> 300000')).toBe('300000');
  });
});
