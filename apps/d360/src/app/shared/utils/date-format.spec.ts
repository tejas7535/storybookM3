import {
  getDateFormatString,
  getDateOrNull,
  getMonthYearFormatString,
  toNativeDate,
} from './date-format';

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

  describe('toNativeDate', () => {
    it('should return the same Date object when a Date is provided', () => {
      const date = new Date(2023, 0, 1); // January 1, 2023
      const result = toNativeDate(date);
      expect(result).toBe(date);
      expect(result instanceof Date).toBe(true);
    });

    it('should convert string date to Date object', () => {
      const dateString = '2023-01-01';
      const result = toNativeDate(dateString);
      expect(result instanceof Date).toBe(true);
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(0); // January is 0
      expect(result.getDate()).toBe(1);
    });

    it('should handle ISO date strings', () => {
      const isoString = '2023-01-01T12:00:00.000Z';
      const result = toNativeDate(isoString);
      expect(result instanceof Date).toBe(true);
      expect(result.toISOString()).toBe(isoString);
    });

    it('should handle timestamp numbers', () => {
      const timestamp = 1_672_531_200_000; // Jan 1, 2023
      const result = toNativeDate(timestamp);
      expect(result instanceof Date).toBe(true);
      expect(result.getTime()).toBe(timestamp);
    });
  });

  describe('getDateOrNull', () => {
    it('should return the date if it is a valid Date object', () => {
      const date = new Date(2023, 0, 1);
      const result = getDateOrNull(date);
      expect(result).toBe(date);
    });

    it('should return null if the date is null', () => {
      const result = getDateOrNull(null);
      expect(result).toBeNull();
    });

    it('should convert a valid date string to a Date object', () => {
      const dateString = '2023-01-01';
      const result = getDateOrNull(dateString as null);
      expect(result instanceof Date).toBe(true);
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });
  });
});
