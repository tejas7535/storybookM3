import {
  endOfMonth,
  isAfter,
  isBefore,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { de } from 'date-fns/locale';

import { DateRangePeriod } from '../../shared/utils/date-range';
import { KpiBucketType, KpiBucketTypeEnum } from './model';

export const firstEditableDate = (period: DateRangePeriod) => {
  switch (period) {
    case 'MONTHLY': {
      return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    }
    case 'WEEKLY': {
      return startOfWeek(new Date(), { locale: de });
    }
    default: {
      throw new Error('Invalid date range period');
    }
  }
};

export const firstEditableDateForTodayInBucket = (
  bucketType: KpiBucketType
): Date => {
  switch (bucketType) {
    case KpiBucketTypeEnum.MONTH: {
      return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    }
    case KpiBucketTypeEnum.WEEK:
    case KpiBucketTypeEnum.PARTIAL_WEEK: {
      let date = new Date();
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
      date = new Date(date.setDate(diff));

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0
      );
    }
    default: {
      throw new Error('UNKNOWN');
    }
  }
};

export const lastEditableDate = () =>
  new Date(new Date().setMonth(new Date().getMonth() + 36));

export const isAfterOrEqual = (date1: Date, date2: Date) =>
  !isBefore(date1, date2);

export const isBeforeOrEqual = (date1: Date, date2: Date) =>
  !isAfter(date1, date2);

export const firstViewableDate = () =>
  startOfMonth(new Date(new Date().setMonth(new Date().getMonth() - 36)));

export const lastViewableDate = () =>
  endOfMonth(new Date(new Date().setMonth(new Date().getMonth() + 36)));
