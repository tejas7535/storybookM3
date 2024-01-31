import { translate } from '@ngneat/transloco';
import { ValueFormatterParams } from 'ag-grid-community';
import moment, { Moment } from 'moment';

import { TimePeriod } from '../models';

export const getTimeRangeHint = (timePeriod: TimePeriod): string => {
  switch (timePeriod) {
    case TimePeriod.YEAR: {
      return translate('filters.periodOfTime.timeRangeHintYear');
    }
    case TimePeriod.MONTH: {
      return translate('filters.periodOfTime.timeRangeHintMonth');
    }
    case TimePeriod.LAST_12_MONTHS: {
      return translate('filters.periodOfTime.timeRangeHintLast12Months');
    }
    default: {
      return '';
    }
  }
};

export const getMonth12MonthsAgo = (refDate: Moment): Moment => {
  const old = refDate.clone().subtract(11, 'months').startOf('month').utc();

  return old;
};

export const getTimeRangeFromDates = (
  dateOne: Moment,
  dateTwo: Moment
): string => `${dateOne.unix()}|${dateTwo.unix()}`;

export const getBeautifiedTimeRange = (timeRange: string): string => {
  if (!timeRange) {
    return undefined;
  }
  const dates = timeRange?.split('|');
  const start = moment.unix(+dates[0]).utc();
  const end = moment.unix(+dates[1]).utc();

  const monthYearFormat = 'MMM YYYY';
  const yearFormat = 'YYYY';

  if (start.year() === end.year() && start.month() === end.month()) {
    return start.format(monthYearFormat);
  } else if (
    start.year() === end.year() &&
    end.month() - start.month() === 11
  ) {
    return start.format(yearFormat);
  } else {
    return `${start.format(monthYearFormat)} - ${end.format(monthYearFormat)}`;
  }
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

export function getPercentageValue(rate: number): number {
  return Math.round(rate * 1000) / 10;
}

export function getPercentageValueSigned(value: number): string {
  return value !== undefined ? `${Number(value)}%` : undefined;
}

export const valueFormatterDate = <T>(
  params: ValueFormatterParams,
  key: keyof T
) =>
  params.data?.[key]
    ? moment.utc(+params.data?.[key]).format('DD/MM/YYYY')
    : '';
