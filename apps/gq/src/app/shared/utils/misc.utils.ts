import { LOCALE_DE } from '@gq/shared/constants';
import { Duration, Keyboard } from '@gq/shared/models';
import moment from 'moment';

import { Rating } from '../models/rating.enum';

export const getCurrentYear = (): number => new Date().getFullYear();

export const getLastYear = (): number => getCurrentYear() - 1;

/**
 * Calculate the duration between the given start and end date.
 *
 * @param startDate start date as ISO string
 * @param endDate end date as ISO string
 * @returns an object, describing the duration
 */
export const calculateDuration = (
  startDate: string,
  endDate: string
): Duration => {
  if (!startDate || !endDate) {
    return undefined;
  }

  const difference = moment(endDate).diff(moment(startDate));
  const duration = moment.duration(difference);

  if (
    duration.hours() > 0 ||
    duration.minutes() > 0 ||
    duration.seconds() > 0 ||
    duration.milliseconds() > 0
  ) {
    // Commenced day counts as additional day
    duration.add(1, 'day');
  }

  return {
    years: duration.years(),
    months: duration.months(),
    days: duration.days(),
  };
};

export const parseLocalizedInputValue = (
  val: string,
  locale: string
): number => {
  if (!val) {
    return 0;
  }
  const isGermanLocale = locale === LOCALE_DE.id;

  const value = isGermanLocale
    ? val.replace(/\./g, Keyboard.EMPTY).replace(/,/g, Keyboard.DOT)
    : val.replace(/,/g, Keyboard.EMPTY);

  return Number.parseFloat(value);
};

export const parseNullableLocalizedInputValue = (
  val: string,
  locale: string
): number => {
  if (!val) {
    return undefined;
  }
  const isGermanLocale = locale === LOCALE_DE.id;

  const value = isGermanLocale
    ? val.replace(/\./g, Keyboard.EMPTY).replace(/,/g, Keyboard.DOT)
    : val.replace(/,/g, Keyboard.EMPTY);

  return Number.parseFloat(value);
};

export const validateQuantityInputKeyPress = (event: KeyboardEvent): void => {
  const inputIsAllowedSpecialKey =
    Keyboard.BACKSPACE === event.key || Keyboard.DELETE === event.key;

  if (
    Number.isNaN(Number.parseInt(event.key, 10)) &&
    !inputIsAllowedSpecialKey &&
    !isPaste(event)
  ) {
    event.preventDefault();
  }
};

const isPaste = (event: KeyboardEvent): boolean =>
  (event.ctrlKey && event.key === 'v') || (event.metaKey && event.key === 'v'); // support for macOs

export function getRatingText(rating: number): string {
  return Rating[rating];
}
