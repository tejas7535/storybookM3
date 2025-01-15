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
