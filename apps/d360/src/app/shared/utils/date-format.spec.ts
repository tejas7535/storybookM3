import { getDateFormatString, getMonthYearFormatString } from './date-format';

describe('Date Format Utilities', () => {
  describe('getDateFormatString', () => {
    it('should return the correct date format string for German locale', () => {
      const locale = 'de';
      const result = getDateFormatString(locale);
      expect(result).toBe('dd.MM.yyyy');
    });

    it('should return the correct date format string for US locale', () => {
      const locale = 'en-US';
      const result = getDateFormatString(locale);
      // Expected format is typically 'MM/dd/yyyy' for US locale
      expect(result).toBe('MM/dd/yyyy');
    });
  });

  describe('getMonthYearFormatString', () => {
    it('should return the correct month-year format string for German locale', () => {
      const locale = 'de';
      const result = getMonthYearFormatString(locale);
      expect(result).toBe('MM.yyyy');
    });

    it('should return the correct month-year format string for US locale', () => {
      const locale = 'en-US';
      const result = getMonthYearFormatString(locale);
      expect(result).toBe('MM/yyyy');
    });
  });
});
