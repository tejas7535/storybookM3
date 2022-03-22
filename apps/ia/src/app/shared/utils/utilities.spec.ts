import { TimePeriod } from '../models';
import {
  getBeautifiedTimeRange,
  getMonth12MonthsAgo,
  getTimeRangeFromDates,
  getTimeRangeHint,
} from './utilities';

describe('utilities', () => {
  describe('setTimeRangeHint', () => {
    test('set correct hint value - year', () => {
      const result = getTimeRangeHint(TimePeriod.YEAR);

      expect(result).toEqual('translate it');
    });

    test('set correct hint value - month', () => {
      const result = getTimeRangeHint(TimePeriod.MONTH);

      expect(result).toEqual('translate it');
    });
    test('set correct hint value - last 12 month', () => {
      const result = getTimeRangeHint(TimePeriod.LAST_12_MONTHS);

      expect(result).toEqual('translate it');
    });
    test('set correct hint value - custom', () => {
      const result = getTimeRangeHint(TimePeriod.CUSTOM);

      expect(result).toEqual('translate it');
    });
  });

  describe('getMonth12MonthsAgo', () => {
    test('should return date that is 12 months older', () => {
      const date = new Date(2020, 1, 1);

      const expected = new Date(2019, 1, 1);

      expect(getMonth12MonthsAgo(date)).toEqual(expected);
    });
  });

  describe('getTimeRangeFromDates', () => {
    test('should return time range string from dates', () => {
      const first = new Date(1_577_863_715_000);
      const second = new Date(1_609_399_715_000);

      const result = getTimeRangeFromDates(first, second);

      expect(result).toEqual('1577863715000|1609399715000');
    });
  });

  describe('getBeautifiedTimeRange', () => {
    test('should return beautified representation of time frame', () => {
      const timeRange = '1577863715000|1609399715000';

      const result = getBeautifiedTimeRange(timeRange);
      expect(result.match(/\d+\s-\s\d+/).length === 1).toBeTruthy();
    });

    test('should return undefined representation of time frame', () => {
      const timeRange: string = undefined;

      const result = getBeautifiedTimeRange(timeRange);
      expect(result).toBeUndefined();
    });
  });
});
