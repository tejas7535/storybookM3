import { TimePeriod } from '../models';

export const getTimeRangeHint = (timePeriod: TimePeriod): string => {
  switch (timePeriod) {
    case TimePeriod.YEAR: {
      return 'year';
    }
    case TimePeriod.MONTH: {
      return 'month';
    }
    case TimePeriod.LAST_12_MONTHS: {
      return 'reference date';
    }
    default: {
      return 'time range';
    }
  }
};
