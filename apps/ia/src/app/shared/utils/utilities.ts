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
