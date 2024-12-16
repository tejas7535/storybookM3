import { LsaCurrencyPipe } from './lsa-currency.pipe';

describe('CustomCurrencyPipe', () => {
  let pipe: LsaCurrencyPipe;

  beforeEach(() => {
    pipe = new LsaCurrencyPipe();
  });

  it('should add a space between currency symbol and amount for €2.79', () => {
    const result = pipe.transform('€2.79');
    expect(result).toBe('€ 2.79');
  });

  it('should add a space between currency symbol and amount for SGD2.79', () => {
    const result = pipe.transform('SGD2.79');
    expect(result).toBe('SGD 2.79');
  });

  it('should return null for null input', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = pipe.transform(null);
    expect(result).toBeNull();
  });

  it('should return undefined for undefined input', () => {
    const result = pipe.transform(undefined);
    expect(result).toBeUndefined();
  });

  it('should return the same value if no currency symbol is present', () => {
    const result = pipe.transform('2.79');
    expect(result).toBe('2.79');
  });

  it('should handle empty string input', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });
});
