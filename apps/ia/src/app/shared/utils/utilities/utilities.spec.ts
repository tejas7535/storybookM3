import { ValueFormatterParams } from 'ag-grid-community';
import moment from 'moment';

import { FilterDimension, TimePeriod } from '../../models';
import {
  convertTimeRangeToUTC,
  getAllowedFilterDimensions,
  getBeautifiedTimeRange,
  getMonth12MonthsAgo,
  getPercentageValue,
  getPercentageValueSigned,
  getTimeRangeFromDates,
  getTimeRangeHint,
  valueFormatterDate,
} from './utilities';

jest.mock('../../guards/is-feature-enabled', () => ({
  ...jest.requireActual('../../guards/is-feature-enabled'),
  isFeatureEnabled: jest.fn(() => true),
}));
describe('utilities', () => {
  describe('getTimeRangeHint', () => {
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
  });

  describe('getMonth12MonthsAgo', () => {
    test('should return date that is 12 months older', () => {
      const date = moment({ year: 2020, month: 1, date: 12 });

      const expected = moment({ year: 2019, month: 2, date: 1 });

      const newLocal = getMonth12MonthsAgo(date);
      expect(newLocal.isSame(expected)).toBeTruthy();
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

    test('should return representation of year', () => {
      const timeRange = '1577863715|1609372800';

      const result = getBeautifiedTimeRange(timeRange);
      expect(result).toEqual('2020');
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

  describe('getPercentageValue', () => {
    test('should return value multiplied by 100', () => {
      const value = 0.04;

      const result = getPercentageValue(value);

      expect(result).toEqual(4);
    });

    test('should return value multiplied by 100 with 2 positions after comma', () => {
      const value = 0.041_818_156;

      const result = getPercentageValue(value);

      expect(result).toEqual(4.2);
    });
  });

  describe('getPercentageValueSigned', () => {
    test('should return value multiplied by 100 with percentage sign', () => {
      const value = 4.3;

      const result = getPercentageValueSigned(value);

      expect(result).toEqual('4.3%');
    });

    test('should return undefined when parameter undefined', () => {
      const result = getPercentageValueSigned(undefined as number);

      expect(result).toBeUndefined();
    });
  });

  describe('valueFormatterDate', () => {
    test('should format date after 9th', () => {
      const exitDate = '1693440000000'; // 2023-08-31

      const result = valueFormatterDate(
        {
          data: {
            exitDate,
          },
        } as ValueFormatterParams,
        'exitDate'
      );

      expect(result).toEqual('31/08/2023');
    });

    test('should format date before 9th', () => {
      const exitDate = '1691539200000'; // 2023-08-09

      const result = valueFormatterDate(
        {
          data: {
            exitDate,
          },
        } as ValueFormatterParams,
        'exitDate'
      );

      expect(result).toEqual('09/08/2023');
    });

    test('should return empty string when value undefined', () => {
      const result = valueFormatterDate(
        {
          data: {
            exitDate: undefined,
          },
        } as ValueFormatterParams,
        'exitDate'
      );

      expect(result).toEqual('');
    });
  });

  describe('getAllowedFilterDimensions', () => {
    test('should return all dimensions', () => {
      const expected = [
        { dimension: FilterDimension.ORG_UNIT, level: 0 },
        { dimension: FilterDimension.PERSONAL_AREA, level: 0 },
        { dimension: FilterDimension.JOB_FAMILY, level: 0 },
        { dimension: FilterDimension.JOB_SUB_FAMILY, level: 1 },
        { dimension: FilterDimension.JOB, level: 2 },
        { dimension: FilterDimension.REGION, level: 0 },
        { dimension: FilterDimension.SUB_REGION, level: 1 },
        { dimension: FilterDimension.COUNTRY, level: 2 },
        { dimension: FilterDimension.HR_LOCATION, level: 3 },
        { dimension: FilterDimension.BOARD, level: 0 },
        { dimension: FilterDimension.SUB_BOARD, level: 1 },
        { dimension: FilterDimension.FUNCTION, level: 2 },
        { dimension: FilterDimension.SUB_FUNCTION, level: 3 },
        { dimension: FilterDimension.SEGMENT, level: 0 },
        { dimension: FilterDimension.SUB_SEGMENT, level: 1 },
        { dimension: FilterDimension.SEGMENT_UNIT, level: 2 },
      ];

      const result = getAllowedFilterDimensions();

      expect(result).toEqual(expected);
    });
  });
});
