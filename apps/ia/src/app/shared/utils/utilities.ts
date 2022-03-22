import { translate } from '@ngneat/transloco';

import { TimePeriod } from '../models';

export const getTimeRangeHint = (timePeriod: TimePeriod): string => {
  switch (timePeriod) {
    case TimePeriod.YEAR: {
      return translate('filters.periodOfTime.year')?.toLowerCase();
    }
    case TimePeriod.MONTH: {
      return translate('filters.periodOfTime.month')?.toLowerCase();
    }
    case TimePeriod.LAST_12_MONTHS: {
      return translate('filters.periodOfTime.referenceDate');
    }
    default: {
      return translate('filters.periodOfTime.timeRangeLabel')?.toLowerCase();
    }
  }
};

export const getMonth12MonthsAgo = (refDate: Date): Date => {
  const old = new Date(refDate.getTime());
  old.setFullYear(refDate.getFullYear() - 1);

  return old;
};

export const getTimeRangeFromDates = (dateOne: Date, dateTwo: Date): string =>
  `${dateOne.getTime()}|${dateTwo.getTime()}`;

export const getBeautifiedTimeRange = (timeRange: string): string => {
  const dates = timeRange?.split('|');

  return timeRange
    ? `${new Date(+dates[0]).toLocaleDateString('en-US')} - ${new Date(
        +dates[1]
      ).toLocaleDateString('en-US')}`
    : undefined;
};
