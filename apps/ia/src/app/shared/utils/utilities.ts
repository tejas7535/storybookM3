import { translate } from '@ngneat/transloco';

import { TimePeriod } from '../models';

export const getTimeRangeHint = (timePeriod: TimePeriod): string => {
  switch (timePeriod) {
    case TimePeriod.YEAR: {
      return translate<string>('filters.periodOfTime.year')?.toLowerCase();
    }
    case TimePeriod.MONTH: {
      return translate<string>('filters.periodOfTime.month')?.toLowerCase();
    }
    case TimePeriod.LAST_12_MONTHS: {
      return translate('filters.periodOfTime.referenceDate');
    }
    default: {
      return translate<string>(
        'filters.periodOfTime.timeRangeLabel'
      )?.toLowerCase();
    }
  }
};
