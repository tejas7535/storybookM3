import { formatISODateToISODateString } from './parse-values';

describe('formatDateToISOString(…)', () => {
  it('returns null for null input', () => {
    expect(formatISODateToISODateString(null)).toBeNull();
  });

  it('formats Date object to ISO string', () => {
    const date = new Date('2023-10-01T00:00:00Z');
    expect(formatISODateToISODateString(date)).toEqual('2023-10-01');
  });
});
