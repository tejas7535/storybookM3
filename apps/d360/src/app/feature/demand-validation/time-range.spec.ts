import { endOfMonth } from 'date-fns';

import { DateRange } from '../../shared/utils/date-range';
import { fillGapBetweenRanges } from './time-range';

describe('fillGapBetweenRanges', () => {
  test('returns undefined when dateRange1 is missing "from"', () => {
    const dateRange1: Partial<DateRange> = {
      to: new Date('2020-10-20'),
      period: 'MONTHLY',
    };
    const result = fillGapBetweenRanges(dateRange1, undefined as undefined);
    expect(result).toBeUndefined();
  });

  test('returns undefined when dateRange1 is missing "to"', () => {
    const dateRange1: Partial<DateRange> = {
      from: new Date('2020-09-01'),
      period: 'MONTHLY',
    };
    const result = fillGapBetweenRanges(dateRange1, undefined as undefined);
    expect(result).toBeUndefined();
  });

  test('returns undefined when dateRange1 is missing "period"', () => {
    const dateRange1: Partial<DateRange> = {
      from: new Date('2020-09-01'),
      to: new Date('2020-10-20'),
    };
    const result = fillGapBetweenRanges(dateRange1, undefined as undefined);
    expect(result).toBeUndefined();
  });

  describe('dateRange1 is valid and period is not WEEKLY', () => {
    const dateRange1: Partial<DateRange> = {
      from: new Date('2020-10-01'),
      to: new Date('2020-10-31'),
      period: 'MONTHLY',
    };

    test('dateRange2 is undefined', () => {
      const result = fillGapBetweenRanges(dateRange1, undefined as undefined);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: dateRange1.to,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });

    test('dateRange2 is defined and valid', () => {
      const dateRange2: Partial<DateRange> = {
        from: new Date('2020-11-01'),
        to: new Date('2020-11-30'),
        period: 'MONTHLY',
      };
      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: dateRange1.to,
          period: dateRange1.period,
        },
        range2: {
          from: dateRange2.from,
          to: dateRange2.to,
          period: dateRange2.period,
        },
      });
    });

    test('dateRange2 is defined but missing "from"', () => {
      const dateRange2: Partial<DateRange> = {
        to: new Date('2020-11-30'),
        period: 'MONTHLY',
      };
      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: dateRange1.to,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });

    test('dateRange2 is defined but missing "to"', () => {
      const dateRange2: Partial<DateRange> = {
        from: new Date('2020-11-01'),
        period: 'MONTHLY',
      };
      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: dateRange1.to,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });

    test('dateRange2 is defined but missing "period"', () => {
      const dateRange2: Partial<DateRange> = {
        from: new Date('2020-11-01'),
        to: new Date('2020-11-30'),
      };
      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: dateRange1.to,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });
  });

  describe('dateRange1 is valid and period is WEEKLY', () => {
    const dateRange1: Partial<DateRange> = {
      from: new Date('2020-10-01'),
      to: new Date('2020-10-20'),
      period: 'WEEKLY',
    };

    test('dateRange2 is undefined', () => {
      const result = fillGapBetweenRanges(dateRange1, undefined as undefined);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: dateRange1.to,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });

    test('dateRange2 is defined and has "to"', () => {
      const dateRange2: Partial<DateRange> = {
        from: new Date('2020-11-01'),
        to: new Date('2020-11-30'),
        period: 'WEEKLY',
      };
      const expectedEndOfMonth = endOfMonth(dateRange1.to as Date);

      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: expectedEndOfMonth,
          period: dateRange1.period,
        },
        range2: {
          from: dateRange2.from,
          to: dateRange2.to,
          period: dateRange2.period,
        },
      });
    });

    test('dateRange2 is defined but missing "to"', () => {
      const dateRange2: Partial<DateRange> = {
        from: new Date('2020-11-01'),
        period: 'WEEKLY',
      };

      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: dateRange1.to,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });

    test('dateRange2 is defined but missing "from"', () => {
      const dateRange2: Partial<DateRange> = {
        to: new Date('2020-11-30'),
        period: 'WEEKLY',
      };
      const expectedEndOfMonth = endOfMonth(dateRange1.to as Date);

      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: expectedEndOfMonth,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });

    test('dateRange2 is defined but missing "period"', () => {
      const dateRange2: Partial<DateRange> = {
        from: new Date('2020-11-01'),
        to: new Date('2020-11-30'),
      };
      const expectedEndOfMonth = endOfMonth(dateRange1.to as Date);

      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: expectedEndOfMonth,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });
  });

  describe('edge cases and additional scenarios', () => {
    test('dateRange1 has period WEEKLY but dateRange2.to is undefined', () => {
      const dateRange1: Partial<DateRange> = {
        from: new Date('2021-03-01'),
        to: new Date('2021-03-07'),
        period: 'WEEKLY',
      };
      const dateRange2: Partial<DateRange> = {
        from: new Date('2021-03-08'),
        // to is undefined
        period: 'WEEKLY',
      };

      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: dateRange1.to,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });

    test('dateRange1 has period WEEKLY and dateRange2 is null', () => {
      const dateRange1: Partial<DateRange> = {
        from: new Date('2021-04-01'),
        to: new Date('2021-04-07'),
        period: 'WEEKLY',
      };

      const result = fillGapBetweenRanges(dateRange1, null);
      expect(result).toEqual({
        range1: {
          from: dateRange1.from,
          to: dateRange1.to,
          period: dateRange1.period,
        },
        range2: undefined,
      });
    });

    test('both dateRange1 and dateRange2 are invalid', () => {
      const dateRange1: Partial<DateRange> = {
        // Missing "from", "to", and "period"
      };
      const dateRange2: Partial<DateRange> = {
        // Missing "from", "to", and "period"
      };
      const result = fillGapBetweenRanges(dateRange1, dateRange2);
      expect(result).toBeUndefined();
    });
  });
});
