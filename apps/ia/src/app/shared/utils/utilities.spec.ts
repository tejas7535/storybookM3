import moment from 'moment';

import { TimePeriod } from '../models';
import {
  convertTimeRangeToUTC,
  getBeautifiedTimeRange,
  getMonth12MonthsAgo,
  getTimeRangeFromDates,
  getTimeRangeHint,
} from './utilities';

describe('utilities', () => {
  describe('getTimeRangeHint', () => {
    test('set correct hint value - year', () => {
      const result = getTimeRangeHint(TimePeriod.YEAR);

      expect(result).toEqual('translate it');
    });

    test('set correct hint value - last 12 month', () => {
      const result = getTimeRangeHint(TimePeriod.LAST_12_MONTHS);

      expect(result).toEqual('translate it');
    });
  });

  describe('getMonth12MonthsAgo', () => {
    test('should return date that is 12 months older', () => {
      const date = moment({ year: 2020, month: 1, date: 1 });

      const expected = moment({ year: 2019, month: 1, date: 1 });

      expect(getMonth12MonthsAgo(date).isSame(expected)).toBeTruthy();
    });
  });

  describe('getTimeRangeFromDates', () => {
    test('should return time range string from dates', () => {
      const first = moment.unix(1_577_863_715_000);
      const second = moment.unix(1_609_399_715_000);

      const result = getTimeRangeFromDates(first, second);

      expect(result).toEqual('1577863715000|1609399715000');
    });
  });

  describe('getBeautifiedTimeRange', () => {
    test('should return beautified representation of time frame', () => {
      const timeRange = '1577863715000|1609399715000';

      const result = getBeautifiedTimeRange(timeRange);
      expect(result.match(/\D+\s\d+\s-\s\D+\s\d+/).length === 1).toBeTruthy();
    });

    test('should return undefined representation of time frame', () => {
      const timeRange: string = undefined;

      const result = getBeautifiedTimeRange(timeRange);
      expect(result).toBeUndefined();
    });
  });

  describe('convertTimeRangeToUTC', () => {
    test('should return unix timestamp', () => {
      jest.mock('moment', () => ({
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
        ...jest.requireActual<any>('moment'),
        valueOf: jest.fn((val) => `${val}000`),
      }));

      const timeRange = '123|456';

      const result = convertTimeRangeToUTC(timeRange);

      expect(result).toEqual('123000|456000');
    });
  });
});
