import { translate } from '@jsverse/transloco';
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  endOfMonth,
} from 'date-fns';

import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DateRange, DateRangePeriod } from '../../shared/utils/date-range';
import { KpiDateRanges } from './model';

const LOCAL_STORAGE_TIMERANGE_KEY = 'demandValidation.timeRange';

interface LocalStorageTimeRange {
  relativeStartDate: number;
  relativeEndDate: number;
  periodType: DateRangePeriod;
  relativeOptionalEndDate: number | undefined;
}

/**
 * Reads the time range from the local storage
 * @returns The time range as KpiDateRanges
 */
export function readLocalStorageTimeRange(): KpiDateRanges | undefined {
  const relativeTimeRangeString = localStorage.getItem(
    LOCAL_STORAGE_TIMERANGE_KEY
  );
  if (relativeTimeRangeString) {
    const relativeTimeRange = JSON.parse(relativeTimeRangeString);
    const now = new Date(Date.now());

    // eslint-disable-next-line default-case
    switch (relativeTimeRange.periodType) {
      case 'MONTHLY': {
        return {
          range1: {
            from: addMonths(now, relativeTimeRange.relativeStartDate),
            to: addMonths(now, relativeTimeRange.relativeEndDate),
            period: relativeTimeRange.periodType,
          },
          range2: undefined,
        };
      }
      case 'WEEKLY': {
        return {
          range1: {
            from: addDays(now, relativeTimeRange.relativeStartDate),
            to: relativeTimeRange.relativeOptionalEndDate
              ? endOfMonth(addDays(now, relativeTimeRange.relativeEndDate))
              : addDays(now, relativeTimeRange.relativeEndDate),
            period: relativeTimeRange.periodType,
          },
          range2: relativeTimeRange.relativeOptionalEndDate
            ? {
                from: addMonths(
                  addDays(now, relativeTimeRange.relativeEndDate),
                  1
                ),
                to: addMonths(now, relativeTimeRange.relativeOptionalEndDate),
                period: 'MONTHLY',
              }
            : undefined,
        };
      }
    }
  }

  return undefined;
}

/**
 * Function to set the local storage time range
 * @param dateRange1 The first date range
 * @param dateRange2 The second date range
 */
export function saveLocalStorageTimeRange(
  dateRange1: Partial<DateRange>,
  dateRange2: Partial<DateRange> | undefined
): void {
  if (!dateRange1.from || !dateRange1.to) {
    return;
  }

  const now = new Date(Date.now());
  let relativeTimeRange: LocalStorageTimeRange | unknown;

  switch (dateRange1.period) {
    case 'WEEKLY': {
      relativeTimeRange = {
        periodType: 'WEEKLY',
        relativeStartDate: differenceInCalendarDays(dateRange1.from, now),
        relativeEndDate: differenceInCalendarDays(dateRange1.to, now),
        relativeOptionalEndDate: dateRange2?.to
          ? differenceInCalendarMonths(dateRange2.to, now)
          : undefined,
      };
      break;
    }
    case 'MONTHLY': {
      relativeTimeRange = {
        periodType: 'MONTHLY',
        relativeStartDate: differenceInCalendarMonths(dateRange1.from, now),
        relativeEndDate: differenceInCalendarMonths(dateRange1.to, now),
        relativeOptionalEndDate: undefined,
      };
      break;
    }
    default: {
      relativeTimeRange = {};
      break;
    }
  }
  localStorage.setItem(
    LOCAL_STORAGE_TIMERANGE_KEY,
    JSON.stringify(relativeTimeRange)
  );
}

/**
 * When date range 1 ends before the start of date range 2 the missing gap need to be filled.
 * E.g. dateRange1 ends at the 20.10.2020 then the monthly dateRange2 will start at the 1.11.2020
 * -> dateRange1 needs to be shifted to the 31.10.2020 in order to have a concise interval.
 *
 * @param dateRange1
 * @param dateRange2
 */
export function fillGapBetweenRanges(
  dateRange1: Partial<DateRange>,
  dateRange2?: Partial<DateRange>
): { range1: DateRange; range2?: DateRange } | undefined {
  const { from, to, period } = dateRange1;

  if (!from || !to || !period) {
    return undefined;
  }

  const range1: DateRange = {
    from,
    to: period === 'WEEKLY' && dateRange2?.to ? endOfMonth(to) : to,
    period,
  };

  const isDateRange2Valid =
    dateRange2?.from && dateRange2?.to && dateRange2?.period;

  const range2: DateRange | undefined = isDateRange2Valid
    ? {
        from: dateRange2.from,
        to: dateRange2.to,
        period: dateRange2.period,
      }
    : undefined;

  return { range1, range2 };
}

export const defaultMonthlyPeriodTypeOption = {
  id: 'MONTHLY',
  text: translate('validation_of_demand.date_picker.menu_item_month', {}),
};

export const defaultPeriodTypes: SelectableValue[] = [
  {
    id: 'WEEKLY',
    text: translate('validation_of_demand.date_picker.menu_item_week', {}),
  },
  defaultMonthlyPeriodTypeOption,
];
