import { ValueFormatterParams } from 'ag-grid-enterprise';

import { AgGridLocalizationService } from '../services/ag-grid-localization.service';
import {
  AvailableDecimalSeparators,
  ValidationHelper,
} from './validation/validation-helper';

export function strictlyParseInteger(value: string): number {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  return Number.NaN;
}

/**
 * Parses a string to a float.
 * @param value The value to parse
 * @param decimalSeparator The decimal separator to use
 * @returns The parsed float or NaN if the value is not a valid float
 */
export function strictlyParseLocalFloat(
  value: string | number,
  decimalSeparator: AvailableDecimalSeparators
): number {
  if (typeof value === 'number') {
    return value;
  }

  if (
    ValidationHelper.validateForLocalFloat(value, decimalSeparator) !== null
  ) {
    return Number.NaN;
  }

  const valueToCheck =
    decimalSeparator === 'COMMA'
      ? value.replace('.', '').replace(',', '.')
      : value.replace(',', '');

  return Number(valueToCheck);
}

/**
 * Parses and formats a number based on localization settings for display within an AG-Grid cell.
 *
 * @export
 * @param {ValueFormatterParams} params - The parameters containing the value to be formatted.
 * @param {AgGridLocalizationService} agGridLocalizationService  - The instance of the AgGridLocalizationService
 * @return {string} - The formatted string representation of the input number.
 */
export function parseAndFormatNumber(
  params: ValueFormatterParams,
  agGridLocalizationService: AgGridLocalizationService
): string {
  switch (typeof params.value) {
    case 'string': {
      const parsed = strictlyParseLocalFloat(
        params.value,
        ValidationHelper.getDecimalSeparatorForActiveLocale()
      );

      return Number.isNaN(parsed)
        ? params.value
        : agGridLocalizationService.numberFormatter({
            ...params,
            value: parsed,
          });
    }

    case 'number': {
      return agGridLocalizationService.numberFormatter(params);
    }

    default: {
      return params.value;
    }
  }
}

/**
 * This method will 'unformat' a number that has been formatted to a locale string.
 *
 * Hint: It will return the unformatted number in case the conversion was successful,
 * otherwise it will return the original number using parseFloat to convert it to type number.
 * This could result in NaN!
 *
 * @private
 * @param {string} number
 * @param {string} locale
 * @return {number}
 */
export function getNumberFromLocale(number: string, locale: string): number {
  let unformatted: string = number;

  const thousandSeparator = getThousandSeparator(locale);
  const decimalSeparator = getDecimalSeparator(locale);

  if (thousandSeparator && decimalSeparator) {
    // fr-FR uses a space as a thousand separator
    unformatted = unformatted.replaceAll(' ', '');
    unformatted = unformatted.replaceAll(thousandSeparator, '');
    unformatted = unformatted.replaceAll(decimalSeparator, '.');

    return Number.parseFloat(unformatted);
  }

  return Number.parseFloat(number);
}

export function numberIsAtStartOfDecimal(
  number: string,
  locale: string
): boolean {
  let unformatted: string = number;

  const thousandSeparator = getThousandSeparator(locale);
  const decimalSeparator = getDecimalSeparator(locale);

  if (thousandSeparator && decimalSeparator) {
    unformatted = unformatted.replaceAll(thousandSeparator, '');
    unformatted = unformatted.replaceAll(decimalSeparator, '.');

    return unformatted.endsWith('.');
  }

  return false;
}

export function getDecimalSeparator(locale: string): string {
  const parts: string[] | null = (1234.5)
    .toLocaleString(locale)
    .match(/(\D+)/g);

  if (parts) {
    return parts[1];
  }

  return null;
}

export function getThousandSeparator(locale: string): string {
  const parts: string[] | null = (1234.5)
    .toLocaleString(locale)
    .match(/(\D+)/g);

  if (parts) {
    return parts[0];
  }

  return null;
}
