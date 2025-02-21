import * as dateFns from 'date-fns';

import {
  firstEditableDate,
  firstEditableDateForTodayInBucket,
  firstViewableDate,
  isAfterOrEqual,
  isBeforeOrEqual,
  lastEditableDate,
  lastViewableDate,
} from './limits';
import { KpiBucketTypeEnum } from './model';

// activate overwriting date-fns functions
jest.mock('date-fns', () => ({
  __esModule: true,
  ...jest.requireActual('date-fns'),
}));

describe('Limits', () => {
  describe('firstEditableDate', () => {
    it('should return the first day of the current month for MONTHLY period', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 3, 2));

      jest.spyOn(dateFns, 'startOfMonth').mockReturnValue(new Date(2022, 3, 1));
      const result = firstEditableDate('MONTHLY');
      expect(result).toEqual(new Date(2022, 3, 1));

      jest.useRealTimers();
    });

    it('should return the start of the current week for WEEKLY period', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 3, 5));

      jest.spyOn(dateFns, 'startOfWeek').mockReturnValue(new Date(2022, 3, 4)); // Mocking a Monday in April
      const result = firstEditableDate('WEEKLY');
      expect(result).toEqual(new Date(2022, 3, 4));

      jest.useRealTimers();
    });

    it('should throw an error for invalid date range period', () => {
      expect(() => firstEditableDate('INVALID' as any)).toThrow(
        'Invalid date range period'
      );
    });

    it('should throw an error for null period', () => {
      expect(() => firstEditableDate(null as any)).toThrow(
        'Invalid date range period'
      );
    });

    it('should throw an error for undefined period', () => {
      expect(() => firstEditableDate(undefined as any)).toThrow(
        'Invalid date range period'
      );
    });
  });

  describe('firstEditableDateForTodayInBucket', () => {
    it('should return the first day of the current month for MONTH bucketType', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 3, 15));

      const result = firstEditableDateForTodayInBucket(KpiBucketTypeEnum.MONTH);
      expect(result).toEqual(new Date(2022, 3, 1)); // Should be the first day of April 2022

      jest.useRealTimers();
    });

    it('should return the start of the current week for WEEK bucketType', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 3, 15)); // Mocking a Friday in April 2022

      const result = firstEditableDateForTodayInBucket(KpiBucketTypeEnum.WEEK);
      expect(result).toEqual(new Date(2022, 3, 11, 0, 0, 0));

      jest.useRealTimers();
    });

    it('should return the start of the current week for PARTIAL_WEEK bucketType', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 3, 15)); // Mocking a Friday in April 2022

      const result = firstEditableDateForTodayInBucket(
        KpiBucketTypeEnum.PARTIAL_WEEK
      );
      expect(result).toEqual(new Date(2022, 3, 11, 0, 0, 0));

      jest.useRealTimers();
    });

    it('should throw an error for unknown bucketType', () => {
      expect(() => firstEditableDateForTodayInBucket('UNKNOWN' as any)).toThrow(
        'UNKNOWN'
      );
    });

    it('should throw an error for null bucketType', () => {
      expect(() => firstEditableDateForTodayInBucket(null as any)).toThrow(
        'UNKNOWN'
      );
    });

    it('should throw an error for undefined bucketType', () => {
      expect(() => firstEditableDateForTodayInBucket(undefined as any)).toThrow(
        'UNKNOWN'
      );
    });
  });

  describe('lastEditableDate', () => {
    it('should return the date three years from now', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 3, 1)); // Mocking a date in April 2022

      const result = lastEditableDate();
      expect(result).toEqual(new Date(2025, 3, 1)); // Should be three years from now (April 2025)

      jest.useRealTimers();
    });
  });

  describe('isAfterOrEqual', () => {
    it('should return true if date1 is after or equal to date2', () => {
      const result = isAfterOrEqual(
        new Date(2022, 3, 1),
        new Date(2022, 2, 31)
      ); // April 1st and March 31st
      expect(result).toBeTruthy();
    });

    it('should return false if date1 is before date2', () => {
      const result = isAfterOrEqual(
        new Date(2022, 2, 31),
        new Date(2022, 3, 1)
      ); // March 31st and April 1st
      expect(result).toBeFalsy();
    });
  });

  describe('isBeforeOrEqual', () => {
    it('should return true if date1 is before or equal to date2', () => {
      const result = isBeforeOrEqual(
        new Date(2022, 2, 31),
        new Date(2022, 3, 1)
      ); // March 31st and April 1st
      expect(result).toBeTruthy();
    });

    it('should return false if date1 is after date2', () => {
      const result = isBeforeOrEqual(
        new Date(2022, 3, 1),
        new Date(2022, 2, 31)
      ); // April 1st and March 31st
      expect(result).toBeFalsy();
    });
  });

  describe('firstViewableDate', () => {
    it('should return the first day of the month three years ago', () => {
      jest.spyOn(dateFns, 'startOfMonth').mockReturnValue(new Date(2019, 3, 1));
      const result = firstViewableDate();
      expect(result).toEqual(new Date(2019, 3, 1));
    });
  });

  describe('lastViewableDate', () => {
    it('should return the last day of the month three years from now', () => {
      jest.spyOn(dateFns, 'endOfMonth').mockReturnValue(new Date(2025, 3, 30)); // Mocking end of April 2025
      const result = lastViewableDate();
      expect(result).toEqual(new Date(2025, 3, 30));
    });
  });
});
