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
