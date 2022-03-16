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
  old.setMonth(refDate.getMonth() - 12);
  old.setDate(old.getDate() + 1);

  return old;
};

export const getTimeRangeFromDates = (dateOne: Date, dateTwo: Date): string =>
  `${dateOne.getTime()}|${dateTwo.getTime()}`;
