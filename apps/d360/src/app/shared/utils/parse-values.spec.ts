import { formatDateToISOString } from './parse-values';
import { ValidationHelper } from './validation/validation-helper';

describe('formatDateToISOString(…)', () => {
  it('returns null for empty string', () => {
    expect(formatDateToISOString('')).toBeNull();
  });

  it('returns null for null input', () => {
    expect(formatDateToISOString(null)).toBeNull();
  });

  it('formats Date object to ISO string', () => {
    const date = new Date('2023-10-01T00:00:00Z');
    expect(formatDateToISOString(date)).toEqual('2023-10-01');
  });

  it('parses and formats localized date string to ISO string', () => {
    const dateString = '31.12.2025';
    jest.spyOn(ValidationHelper, 'getDateFormat').mockReturnValue('dd.MM.yyyy');
    expect(formatDateToISOString(dateString)).toEqual('2025-12-31');
  });
});
