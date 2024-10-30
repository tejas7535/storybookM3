// TODO implement this file with TranslocoLocaleService

import { deduplicateArray } from '../array';

// DECIMAL SEPARATOR --> This is from l10n.ts
export const availableDecimalSeparators = ['PERIOD', 'COMMA'] as const;
export type AvailableDecimalSeparators =
  (typeof availableDecimalSeparators)[number];

/**
 * Validates a string for letter chars (case insensitive without umlauts).
 * An empty string is an error.
 * @param value string to check
 * @returns null if validation succeeded or a string with the error message
 */
export function validateForLetters(value: string): string | null {
  const regex = /^[A-Za-z]+$/;
  const valid = regex.test(value);

  return valid ? null : 'error.letters';
}

/**
 * Validates a string for numbers chars.
 * An empty string is an error.
 * @param value string to check
 * @returns null if validation succeeded or a string with the error message
 */
export function validateForNumbers(value: string): string | null {
  const regex = /^\d+$/;
  const valid = regex.test(value);

  return valid ? null : 'error.numbers';
}

// export function validateForFloat(value: string): string | null {
//   return validateForLocalFloat(value, preferredDecimalSeparator);
// }

export function validateForLocalFloat(
  value: string,
  decimalSeparator: AvailableDecimalSeparators
): string | null {
  // only allow digits and . and , (no negative values or other special things)
  const regex =
    decimalSeparator === 'COMMA'
      ? /^\d+(\.\d{3})*(,\d+)?$/
      : /^\d+(,\d{3})*(\.\d+)?$/;
  const valid = regex.test(value);

  return valid ? null : `error.numbers.${decimalSeparator}`;
}

/**
 * Validates a string for numbers chars with a star (*).
 * An empty string is an error.
 * @param value string to check
 * @returns null if validation succeeded or a string with the error message
 */
export function validateForNumbersWithStar(value: string): string | null {
  const regex = /^[\d*]+$/;
  const valid = regex.test(value);

  return valid ? null : 'error.number_stars';
}

// /**
//  * Validates a string for date chars.
//  * An empty string is an error.
//  * @param value string to check
//  * @returns null if validation succeeded or a string with the error message
//  */
// export function validateDateFormat(value: string): string | null {
//   const valid = isMatch(value, preferredDateFormat);
//   return valid ? null : 'error.date.invalidFormat';
// }
//
// export function validateAnyDateFormat(value: string): string | null {
//   const date = parseDate(value);
//   return date ? null : 'error.date.invalidFormat';
// }
//
// /**
//  * Validates a string for date format and checks if it is greater than or equal to today's date.
//  * An empty string is an error.
//  * @param value string to check
//  * @returns null if validation succeeded or a string with the error message
//  */
// export function validateDateFormatAndGreaterEqualThanToday(value: string): string | null {
//   const validFormatError = validateDateFormat(value);
//   if (validFormatError) return validFormatError;
//
//   const isDateGreaterEqualThanToday =
//     parse(value, preferredDateFormat, new Date()) >= startOfDay(Date.now());
//   const dateIsGreaterEqualThanToday = isDateGreaterEqualThanToday
//     ? null
//     : 'error.date.beforeMin';
//
//   return dateIsGreaterEqualThanToday;
// }
//
// export function validateAnyDateFormatAndGreaterEqualThanToday(value: string): string | null {
//   const validFormatError = validateAnyDateFormat(value);
//   if (validFormatError) return validFormatError;
//
//   const isDateGreaterEqualThanToday =
//     parse(value, preferredDateFormat, new Date()) >= startOfDay(Date.now());
//   const dateIsGreaterEqualThanToday = isDateGreaterEqualThanToday
//     ? null
//     : 'error.date.beforeMin';
//
//   return dateIsGreaterEqualThanToday;
// }

/**
 * Check a string for an exact length
 */
export function validateExactLength(
  value: string,
  targetLength: number
): string | null {
  return value.trim().length === targetLength ? null : 'error.wrong_length';
}

/**
 * Check a string for an maximum length
 */
export function validateMaxLength(
  value: string,
  maxLength: number
): string | null {
  return value.trim().length <= maxLength ? null : 'error.too_long';
}

/**
 * Returns a function that fills a string with a number of leading zeros.
 * Does not check for number chars.
 * If the string is longer than than the requested string, returns the input.
 * @param targetLength Length the string should have after
 * @returns function
 */
export const fillZeroFunc =
  (targetLength: number) =>
  (value: string): string =>
    value.padStart(targetLength, '0');

/**
 * Returns a value that fills the string of the params with a number of leading zeros.
 * Does not check for number chars.
 * If the string is longer than the requested string, returns the input.
 * @param targetLength Length the string should have after
 * @param value
 */
export const fillZeroOnValueFunc = (targetLength: number, value: string) =>
  value.padStart(targetLength, '0');

/**
 * Condenses / aggregates an array of validation results
 * (null if validation succeeded or an error message if not)
 * to one array of error messages or null (if all validations succeeded).
 */
export function condenseValidationResults(
  result: (string | null)[]
): string[] | null {
  const results = result.filter((r) => r != null) as string[];

  if (results.length === 0) {
    return null;
  }

  return deduplicateArray(results);
}

export function condenseErrorsFromValidation(
  fn: (value: string) => string[] | null
): (value: string) => string | undefined {
  return (value: string) => fn(value)?.join(', ');
}
