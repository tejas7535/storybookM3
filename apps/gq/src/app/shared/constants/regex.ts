import { LOCALE_DE } from './available-locales';
export const quantityRegex = /^\d+$/;
const quantityRegexDE = /^[1-9](\d{0,2})*(.\d{3})*$/;

const quantityRegexEN = /^[1-9](\d{0,2})*(,\d{3})*$/;

const currencyRegexEN =
  /\d{3,}\.\d{1,2}?$|^\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$|^\d+$/;
const currencyRegexDE =
  /\d{3,},\d{1,2}?$|^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+$/;
const numberFilterRegexEN =
  /^-?\d{3,}\.\d{1,2}?$|^\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$|^\d+$/;
const numberFilterRegexDE =
  /^-?\d{3,},\d{1,2}?$|^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+$/;

/**
 * Allow values from -99 to 99 with max. two decimal places and a comma as a decimal separator.
 *
 * Following values are valid: -11; 11; 11,1; 11,11; -1; 1; 1,1; 1,11
 * Following values are not valid: -111; 111; 11,111; 111,11; 111,; 11.11; 11.1
 */
const percentageRegexDE = /^-?\d{1,2}(?:,\d{1,2})?$/;

/**
 * Allow values from -99 to 99 with max. two decimal places and a dot as a decimal separator.
 *
 * Following values are valid: -11; 11; 11.1; 11.11; -1; 1; 1.1; 1.11
 * Following values are not valid: -111; 111; 11.111; 111.11; 111.; 11,11; 11,1
 */
const percentageRegexEN = /^-?\d{1,2}(?:\.\d{1,2})?$/;

export const getPercentageRegex = (locale: string): RegExp =>
  locale === LOCALE_DE.id ? percentageRegexDE : percentageRegexEN;

export const getCurrencyRegex = (locale: string): RegExp =>
  locale === LOCALE_DE.id ? currencyRegexDE : currencyRegexEN;

export const getNumberFilterRegex = (locale: string): RegExp =>
  locale === LOCALE_DE.id ? numberFilterRegexDE : numberFilterRegexEN;

export const getQuantityRegex = (locale: string): RegExp =>
  locale === LOCALE_DE.id ? quantityRegexDE : quantityRegexEN;

export const timestampRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{6}Z/;
