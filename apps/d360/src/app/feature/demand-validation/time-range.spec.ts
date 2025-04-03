import { addDays, addMonths, endOfMonth, startOfMonth } from 'date-fns';

import { DateRange } from '../../shared/utils/date-range';
import {
  defaultMonthlyPeriodTypeOption,
  defaultPeriodTypes,
  fillGapBetweenRanges,
  readLocalStorageTimeRange,
  saveLocalStorageTimeRange,
} from './time-range';

describe('TimeRange', () => {
  describe('readLocalStorageTimeRange', () => {
    const LOCAL_STORAGE_TIMERANGE_KEY = 'demandValidation.timeRange';
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2025, 4, 2));
    });

    afterEach(() => {
      jest.useRealTimers();
      localStorage.clear();
    });

    it('should return undefined if localStorage does not contain the time range key', () => {
      const result = readLocalStorageTimeRange();
      expect(result).toBeUndefined();
    });

    it('should return a valid KpiDateRanges object for MONTHLY periodType', () => {
      const mockTimeRange = {
        relativeStartDate: -1,
        relativeEndDate: 1,
        periodType: 'MONTHLY',
      };
      localStorage.setItem(
        LOCAL_STORAGE_TIMERANGE_KEY,
        JSON.stringify(mockTimeRange)
      );

      const result = readLocalStorageTimeRange();
      const now = new Date(Date.now());

      expect(result).toEqual({
        range1: {
          from: startOfMonth(addMonths(now, mockTimeRange.relativeStartDate)),
          to: endOfMonth(addMonths(now, mockTimeRange.relativeEndDate)),
          period: 'MONTHLY',
        },
        range2: undefined,
      });
    });

    it('should return a valid KpiDateRanges object for WEEKLY periodType without optional end date', () => {
      const mockTimeRange = {
        relativeStartDate: -7,
        relativeEndDate: 7,
        periodType: 'WEEKLY',
        relativeOptionalEndDate: undefined,
      } as any;
      localStorage.setItem(
        LOCAL_STORAGE_TIMERANGE_KEY,
        JSON.stringify(mockTimeRange)
      );

      const result = readLocalStorageTimeRange();
      const now = new Date(Date.now());

      expect(result).toEqual({
        range1: {
          from: addDays(now, mockTimeRange.relativeStartDate),
          to: addDays(now, mockTimeRange.relativeEndDate),
          period: 'WEEKLY',
        },
        range2: undefined,
      });
    });

    it('should return a valid KpiDateRanges object for WEEKLY periodType with optional end date', () => {
      const mockTimeRange = {
        relativeStartDate: -7,
        relativeEndDate: 7,
        periodType: 'WEEKLY',
        relativeOptionalEndDate: 2,
      };
      localStorage.setItem(
        LOCAL_STORAGE_TIMERANGE_KEY,
        JSON.stringify(mockTimeRange)
      );

      const result = readLocalStorageTimeRange();
      const now = new Date(Date.now());

      expect(result).toEqual({
        range1: {
          from: addDays(now, mockTimeRange.relativeStartDate),
          to: endOfMonth(addDays(now, mockTimeRange.relativeEndDate)),
          period: 'WEEKLY',
        },
        range2: {
          from: addMonths(addDays(now, mockTimeRange.relativeEndDate), 1),
          to: addMonths(now, mockTimeRange.relativeOptionalEndDate),
          period: 'MONTHLY',
        },
      });
    });
  });

  describe('saveLocalStorageTimeRange', () => {
    const LOCAL_STORAGE_TIMERANGE_KEY = 'demandValidation.timeRange';

    afterEach(() => {
      localStorage.clear();
    });

    it('should not save to localStorage if dateRange1 is missing "from"', () => {
      const dateRange1: Partial<DateRange> = {
        to: new Date('2023-01-31'),
        period: 'MONTHLY',
      };
      const dateRange2: Partial<DateRange> | undefined = undefined;

      saveLocalStorageTimeRange(dateRange1, dateRange2);

      expect(localStorage.getItem(LOCAL_STORAGE_TIMERANGE_KEY)).toBeUndefined();
    });

    it('should not save to localStorage if dateRange1 is missing "to"', () => {
      const dateRange1: Partial<DateRange> = {
        from: new Date('2023-01-01'),
        period: 'MONTHLY',
      };
      const dateRange2: Partial<DateRange> | undefined = undefined;

      saveLocalStorageTimeRange(dateRange1, dateRange2);

      expect(localStorage.getItem(LOCAL_STORAGE_TIMERANGE_KEY)).toBeUndefined();
    });

    it('should save a valid WEEKLY time range to localStorage', () => {
      const now = new Date(Date.now());
      const dateRange1: Partial<DateRange> = {
        from: addDays(now, -7),
        to: addDays(now, 7),
        period: 'WEEKLY',
      };
      const dateRange2: Partial<DateRange> = {
        to: addMonths(now, 1),
      };

      saveLocalStorageTimeRange(dateRange1, dateRange2);

      const savedValue = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_TIMERANGE_KEY) as string
      );

      expect(savedValue).toEqual({
        periodType: 'WEEKLY',
        relativeStartDate: -7,
        relativeEndDate: 7,
        relativeOptionalEndDate: 1,
      });
    });

    it('should save a valid MONTHLY time range to localStorage', () => {
      const now = new Date(Date.now());
      const dateRange1: Partial<DateRange> = {
        from: addMonths(now, -1),
        to: addMonths(now, 1),
        period: 'MONTHLY',
      };
      const dateRange2: Partial<DateRange> | undefined = undefined;

      saveLocalStorageTimeRange(dateRange1, dateRange2);

      const savedValue = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_TIMERANGE_KEY) as string
      );

      expect(savedValue).toEqual({
        periodType: 'MONTHLY',
        relativeStartDate: -1,
        relativeEndDate: 1,
        relativeOptionalEndDate: undefined,
      });
    });

    it('should save an empty object to localStorage for an unsupported period type', () => {
      const dateRange1: Partial<DateRange> = {
        from: new Date('2023-01-01'),
        to: new Date('2023-01-31'),
        period: 'UNSUPPORTED' as any,
      };
      const dateRange2: Partial<DateRange> | undefined = undefined;

      saveLocalStorageTimeRange(dateRange1, dateRange2);

      const savedValue = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_TIMERANGE_KEY) as string
      );

      expect(savedValue).toEqual({});
    });
  });

  describe('fillGapBetweenRanges', () => {
    it('returns undefined when dateRange1 is missing "from"', () => {
      const dateRange1: Partial<DateRange> = {
        to: new Date('2020-10-20'),
        period: 'MONTHLY',
      };
      const result = fillGapBetweenRanges(dateRange1, undefined as undefined);
      expect(result).toBeUndefined();
    });

    it('returns undefined when dateRange1 is missing "to"', () => {
      const dateRange1: Partial<DateRange> = {
        from: new Date('2020-09-01'),
        period: 'MONTHLY',
      };
      const result = fillGapBetweenRanges(dateRange1, undefined as undefined);
      expect(result).toBeUndefined();
    });

    it('returns undefined when dateRange1 is missing "period"', () => {
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

      it('dateRange2 is undefined', () => {
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

      it('dateRange2 is defined and valid', () => {
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

      it('dateRange2 is defined but missing "from"', () => {
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

      it('dateRange2 is defined but missing "to"', () => {
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

      it('dateRange2 is defined but missing "period"', () => {
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

      it('dateRange2 is undefined', () => {
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

      it('dateRange2 is defined and has "to"', () => {
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

      it('dateRange2 is defined but missing "to"', () => {
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

      it('dateRange2 is defined but missing "from"', () => {
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

      it('dateRange2 is defined but missing "period"', () => {
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
      it('dateRange1 has period WEEKLY but dateRange2.to is undefined', () => {
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

      it('dateRange1 has period WEEKLY and dateRange2 is null', () => {
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

      it('both dateRange1 and dateRange2 are invalid', () => {
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

  describe('defaultMonthlyPeriodTypeOption', () => {
    it('should have the correct id and translated text', () => {
      expect(defaultMonthlyPeriodTypeOption).toEqual({
        id: 'MONTHLY',
        text: 'validation_of_demand.date_picker.menu_item_month',
      });
    });
  });

  describe('defaultPeriodTypes', () => {
    it('should include WEEKLY and MONTHLY period types with correct translations', () => {
      expect(defaultPeriodTypes).toEqual([
        {
          id: 'WEEKLY',
          text: 'validation_of_demand.date_picker.menu_item_week',
        },
        {
          id: 'MONTHLY',
          text: 'validation_of_demand.date_picker.menu_item_month',
        },
      ]);
    });
  });
});
