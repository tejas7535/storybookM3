import { LOCALE_DE } from '@gq/shared/constants';
import { Keyboard } from '@gq/shared/models';

export const getCurrentYear = (): number => new Date().getFullYear();

export const getLastYear = (): number => getCurrentYear() - 1;

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
