import { LOCALE_DE } from './available-locales';
export const quantityRegex = /^\d+$/;

const currencyRegexEN =
  /\d{3,}\.\d{1,2}?$|^\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$|^\d+$/;
const currencyRegexDE =
  /\d{3,},\d{1,2}?$|^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+$/;
const numberFilterRegexEN =
  /^-?\d{3,}\.\d{1,2}?$|^\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$|^\d+$/;
const numberFilterRegexDE =
  /^-?\d{3,},\d{1,2}?$|^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+$/;

const percentageRegexDE = /^-?\d{1,2}(?:,\d{1,2})?$|^-?\d,/;
const percentageRegexEN = /^-?\d{1,2}(?:\.\d{1,2})?$|^-?\d+\./;

export const getPercentageRegex = (locale: string): RegExp =>
  locale === LOCALE_DE.id ? percentageRegexDE : percentageRegexEN;

export const getCurrencyRegex = (locale: string): RegExp =>
  locale === LOCALE_DE.id ? currencyRegexDE : currencyRegexEN;

export const getNumberFilterRegex = (locale: string): RegExp =>
  locale === LOCALE_DE.id ? numberFilterRegexDE : numberFilterRegexEN;

export const timestampRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{6}Z/;
