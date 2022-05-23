import { translate } from '@ngneat/transloco';
import moment, { Moment } from 'moment';

import { TimePeriod } from '../models';

export const getTimeRangeHint = (timePeriod: TimePeriod): string =>
  timePeriod === TimePeriod.YEAR
    ? translate('filters.periodOfTime.timeRangeHintYear')
    : translate('filters.periodOfTime.timeRangeHintLast12Months');

export const getMonth12MonthsAgo = (refDate: Moment): Moment => {
  const old = refDate.clone().subtract(11, 'months').startOf('month');

  return old;
};

export const getTimeRangeFromDates = (
  dateOne: Moment,
  dateTwo: Moment
): string => `${dateOne.unix()}|${dateTwo.unix()}`;

export const getBeautifiedTimeRange = (timeRange: string): string => {
  const dates = timeRange?.split('|');

  return timeRange
    ? `${moment
        .unix(+dates[0])
        .utc()
        .format('MMM YYYY')} - ${moment
        .unix(+dates[1])
        .utc()
        .format('MMM YYYY')}`
    : undefined;
};

export const convertTimeRangeToUTC = (timeRange: string) => {
  const dates = timeRange?.split('|');

  return timeRange
    ? `${moment
        .unix(+dates[0])
        .utc()
        .valueOf()}|${moment
        .unix(+dates[1])
        .utc()
        .valueOf()}`
    : undefined;
};
