import { TimePeriod } from '../models';
import { getTimeRangeHint } from './utilities';

describe('utilities', () => {
  describe('setTimeRangeHint', () => {
    test('set correct hint value - year', () => {
      const result = getTimeRangeHint(TimePeriod.YEAR);

      expect(result).toEqual('year');
    });

    test('set correct hint value - month', () => {
      const result = getTimeRangeHint(TimePeriod.MONTH);

      expect(result).toEqual('month');
    });
    test('set correct hint value - last 12 month', () => {
      const result = getTimeRangeHint(TimePeriod.LAST_12_MONTHS);

      expect(result).toEqual('reference date');
    });
    test('set correct hint value - custom', () => {
      const result = getTimeRangeHint(TimePeriod.CUSTOM);

      expect(result).toEqual('time range');
    });
  });
});
