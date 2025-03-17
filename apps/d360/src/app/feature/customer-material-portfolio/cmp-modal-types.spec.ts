import { parsePortfolioStatusOrNull, PortfolioStatus } from './cmp-modal-types';

describe('parsePortfolioStatusOrNull', () => {
  it('should return the correct PortfolioStatus when a valid status is provided', () => {
    const validStatuses: PortfolioStatus[] = [
      'PI',
      'PO',
      'SP',
      'SE',
      'SI',
      'SB',
      'IA',
      'AC',
    ];

    validStatuses.forEach((status) => {
      expect(parsePortfolioStatusOrNull(status)).toBe(status);
    });
  });

  it('should return null when an invalid status is provided', () => {
    const invalidStatuses = ['INVALID', 'UNKNOWN', '', '123', 'ACTIVE'];

    invalidStatuses.forEach((status) => {
      expect(parsePortfolioStatusOrNull(status)).toBeNull();
    });
  });

  it('should return null when an empty string is provided', () => {
    expect(parsePortfolioStatusOrNull('')).toBeNull();
  });

  it('should return null when null is provided', () => {
    expect(parsePortfolioStatusOrNull(null as unknown as string)).toBeNull();
  });

  it('should return null when undefined is provided', () => {
    expect(
      parsePortfolioStatusOrNull(undefined as unknown as string)
    ).toBeNull();
  });
});
