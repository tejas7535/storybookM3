import { addDays, addMonths, endOfMonth, startOfMonth } from 'date-fns';

import { DemandValidationTimeRangeUserSettingsKey } from '../../shared/models/user-settings.model';
import { DateRange, DateRangePeriod } from '../../shared/utils/date-range';
import {
  convertToKpiDateRanges,
  convertToTimeRange,
  fillGapBetweenRanges,
} from './time-range';

describe('TimeRange', () => {
  describe('fillGapBetweenRanges', () => {
    it('returns undefined when dateRange1 is missing "from"', () => {
      const dateRange1: Partial<DateRange> = {
        to: new Date('2020-10-20'),
        period: DateRangePeriod.Monthly,
      };
      const result = fillGapBetweenRanges(dateRange1, undefined as undefined);
      expect(result).toBeUndefined();
    });

    it('returns undefined when dateRange1 is missing "to"', () => {
      const dateRange1: Partial<DateRange> = {
        from: new Date('2020-09-01'),
        period: DateRangePeriod.Monthly,
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
        period: DateRangePeriod.Monthly,
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
          period: DateRangePeriod.Monthly,
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
          period: DateRangePeriod.Monthly,
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
          period: DateRangePeriod.Monthly,
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
        period: DateRangePeriod.Weekly,
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
          period: DateRangePeriod.Weekly,
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
          period: DateRangePeriod.Weekly,
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
          period: DateRangePeriod.Weekly,
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
          period: DateRangePeriod.Weekly,
        };
        const dateRange2: Partial<DateRange> = {
          from: new Date('2021-03-08'),
          // to is undefined
          period: DateRangePeriod.Weekly,
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
          period: DateRangePeriod.Weekly,
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

  describe('convertToKpiDateRanges', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2025, 4, 2));
    });

    afterEach(() => jest.useRealTimers());

    it('should return undefined if data is null or undefined', () => {
      expect(convertToKpiDateRanges(null)).toBeUndefined();
      expect(convertToKpiDateRanges()).toBeUndefined();
    });

    it('should return a monthly range when type is Monthly', () => {
      const data = {
        [DemandValidationTimeRangeUserSettingsKey.Type]:
          DateRangePeriod.Monthly,
        [DemandValidationTimeRangeUserSettingsKey.StartDate]: -3,
        [DemandValidationTimeRangeUserSettingsKey.EndDate]: 2,
        [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]: null,
      } as any;

      const result = convertToKpiDateRanges(data);

      expect(result).toEqual({
        range1: {
          from: startOfMonth(addMonths(new Date(), -3)),
          to: endOfMonth(addMonths(new Date(), 2)),
          period: DateRangePeriod.Monthly,
        },
        range2: undefined,
      });
    });

    it('should return a weekly range when type is Weekly without optionalEndDate', () => {
      const data = {
        [DemandValidationTimeRangeUserSettingsKey.Type]: DateRangePeriod.Weekly,
        [DemandValidationTimeRangeUserSettingsKey.StartDate]: -7,
        [DemandValidationTimeRangeUserSettingsKey.EndDate]: 7,
        [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]: null,
      } as any;

      const result = convertToKpiDateRanges(data);

      expect(result).toEqual({
        range1: {
          from: addDays(new Date(), -7),
          to: addDays(new Date(), 7),
          period: DateRangePeriod.Weekly,
        },
        range2: undefined,
      });
    });

    it('should return a weekly range with a secondary monthly range when optionalEndDate is provided', () => {
      const data = {
        [DemandValidationTimeRangeUserSettingsKey.Type]: DateRangePeriod.Weekly,
        [DemandValidationTimeRangeUserSettingsKey.StartDate]: -7,
        [DemandValidationTimeRangeUserSettingsKey.EndDate]: 7,
        [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]: 2,
      };

      const result = convertToKpiDateRanges(data);

      expect(result).toEqual({
        range1: {
          from: addDays(new Date(), -7),
          to: endOfMonth(addDays(new Date(), 7)),
          period: DateRangePeriod.Weekly,
        },
        range2: {
          from: addMonths(addDays(new Date(), 7), 1),
          to: addMonths(new Date(), 2),
          period: DateRangePeriod.Monthly,
        },
      });
    });

    it('should return undefined for unsupported type', () => {
      const data = {
        [DemandValidationTimeRangeUserSettingsKey.Type]: 'UnsupportedType',
      };

      const result = convertToKpiDateRanges(data as any);

      expect(result).toBeUndefined();
    });
  });

  describe('convertToTimeRange', () => {
    it('should return null if dateRange1 is missing "from"', () => {
      const dateRange1: Partial<DateRange> = {
        to: new Date('2023-10-20'),
        period: DateRangePeriod.Weekly,
      };
      const result = convertToTimeRange(dateRange1);
      expect(result).toBeNull();
    });

    it('should return null if dateRange1 is missing "to"', () => {
      const dateRange1: Partial<DateRange> = {
        from: new Date('2023-10-01'),
        period: DateRangePeriod.Weekly,
      };
      const result = convertToTimeRange(dateRange1);
      expect(result).toBeNull();
    });

    it('should return null if dateRange1 is missing "period"', () => {
      const dateRange1: Partial<DateRange> = {
        from: new Date('2023-10-01'),
        to: new Date('2023-10-20'),
      };
      const result = convertToTimeRange(dateRange1);
      expect(result).toBeNull();
    });

    it('should return a weekly time range when period is Weekly', () => {
      const now = new Date();
      const dateRange1: Partial<DateRange> = {
        from: addDays(now, -7),
        to: addDays(now, 7),
        period: DateRangePeriod.Weekly,
      };
      const dateRange2: Partial<DateRange> = {
        to: addMonths(now, 2),
      };

      const result = convertToTimeRange(dateRange1, dateRange2);

      expect(result).toEqual({
        [DemandValidationTimeRangeUserSettingsKey.Type]: DateRangePeriod.Weekly,
        [DemandValidationTimeRangeUserSettingsKey.StartDate]: -7,
        [DemandValidationTimeRangeUserSettingsKey.EndDate]: 7,
        [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]: 2,
      });
    });

    it('should return a monthly time range when period is Monthly', () => {
      const now = new Date();
      const dateRange1: Partial<DateRange> = {
        from: addMonths(now, -3),
        to: addMonths(now, 2),
        period: DateRangePeriod.Monthly,
      };

      const result = convertToTimeRange(dateRange1);

      expect(result).toEqual({
        [DemandValidationTimeRangeUserSettingsKey.Type]:
          DateRangePeriod.Monthly,
        [DemandValidationTimeRangeUserSettingsKey.StartDate]: -3,
        [DemandValidationTimeRangeUserSettingsKey.EndDate]: 2,
        [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]: null,
      });
    });

    it('should return null for unsupported period type', () => {
      const dateRange1: Partial<DateRange> = {
        from: new Date('2023-10-01'),
        to: new Date('2023-10-20'),
        period: 'UnsupportedPeriod' as DateRangePeriod,
      };

      const result = convertToTimeRange(dateRange1);

      expect(result).toBeNull();
    });
  });
});
