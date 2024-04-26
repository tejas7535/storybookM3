import { LOCALE_DE } from '@gq/shared/constants';
import { Duration, Keyboard } from '@gq/shared/models';
// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';
import moment from 'moment';

import { Rating } from '../models/rating.enum';
export const getCurrentYear = (): number => new Date().getFullYear();

export const getLastYear = (): number => getCurrentYear() - 1;

/**
 * Calculate the duration between the given start and end date.
 * time of the dates is ignored.
 *
 * @param startDate start date as ISO string
 * @param endDate end date as ISO string
 * @returns an object, describing the duration
 */
export const calculateDuration = (
  startDate: string,
  endDate: string,
  locale: string
): Duration => {
  if (!startDate || !endDate) {
    return undefined;
  }
  moment.locale(locale);

  const startDay = moment(
    moment(startDate).locale(locale).format('YYYY-MM-DD')
  );
  const endDay = moment(moment(endDate).locale(locale).format('YYYY-MM-DD'));

  const difference = endDay.diff(startDay);
  const duration = moment.duration(difference);

  //
  // when switch from summer to winter time, there's technically one hour "too much" for a complete day (expectedDays as expected  and duration.hours() => 1),
  // => ****so we will ignore it****
  // isDST => isDaylightSavingTime (summer time)
  if (!startDay.isDST() && endDay.isDST()) {
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
    ? val.replaceAll('.', Keyboard.EMPTY).replaceAll(',', Keyboard.DOT)
    : val.replaceAll(',', Keyboard.EMPTY);

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
    ? val.replaceAll('.', Keyboard.EMPTY).replaceAll(',', Keyboard.DOT)
    : val.replaceAll(',', Keyboard.EMPTY);

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

export function groupBy<T>(arr: T[], fn: (item: T) => any) {
  const groupedBy = new Map();
  for (const listItem of arr) {
    if (groupedBy.has(fn(listItem))) {
      groupedBy.get(fn(listItem)).push(listItem);
    } else {
      groupedBy.set(fn(listItem), [listItem]);
    }
  }

  return groupedBy;
}

/**
 * Converts a string to base64
 *
 * @param value value to be converted to base64
 * @returns the converted value or value if is falsy
 */
export function convertToBase64(value: string): string {
  // eslint-disable-next-line no-param-reassign
  value = value === '' ? null : value;

  return value ? Buffer.from(value.trim(), 'utf8').toString('base64') : value;
}
