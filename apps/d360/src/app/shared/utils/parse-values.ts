import { translate } from '@jsverse/transloco';
import { formatISO, parse } from 'date-fns';

import {
  ReplacementType,
  replacementTypeValues,
} from '../../feature/internal-material-replacement/model';
import {
  DemandCharacteristic,
  demandCharacteristicOptions,
} from '../../feature/material-customer/model';
import { ValidationHelper } from './validation/validation-helper';

/**
 * Parses the date which may contain time information as a date string, otherwise returns the original string
 *
 * @export
 * @param {string} dateString The date string to parse
 * @return {string}
 */
export function parseDateIfPossible(dateString: string): string {
  const hasError = ValidationHelper.validateDateFormat(dateString);

  return hasError
    ? dateString
    : ValidationHelper.localeService.localizeDate(
        parse(dateString, ValidationHelper.getDateFormat(), new Date()),
        ValidationHelper.localeService.getLocale(),
        { day: '2-digit', month: '2-digit', year: 'numeric' }
      );
}

/**
 * Formats the date which may contain time information to date string.
 *
 * @param date The date string to format
 */
export function formatISODateToISODateString(date: Date | null) {
  return date ? formatISO(date, { representation: 'date' }) : null;
}

/**
 * Parses the demand characteristic if possible, otherwise returns the original string
 * @param value The demand characteristic string to parse
 */
export function parseDemandCharacteristicIfPossible(value: string): string {
  const localizationKeyCreation = (key: DemandCharacteristic) =>
    translate(`demand_characteristics.${key}`);

  const parsed = parseToStringLiteralTypeIfPossible<DemandCharacteristic>(
    value,
    demandCharacteristicOptions,
    localizationKeyCreation
  );

  return parsed ?? value;
}

/**
 * Parses the replacement type if possible, otherwise returns the original string
 * @param value The replacement type string to parse
 */
export function parseReplacementTypeIfPossible(
  value: string
): ReplacementType | string {
  const localizationKeyCreation = (val: ReplacementType) =>
    translate(`replacement_type.${val}`);
  const parsed = parseToStringLiteralTypeIfPossible<ReplacementType>(
    value,
    replacementTypeValues,
    localizationKeyCreation
  );

  return parsed ?? value;
}

/**
 * Parses a string to a string literal type if possible, otherwise returns undefined
 * @param valueToParse The value to parse
 * @param stringLiteralArray The array of string literals to parse to
 * @param localizationFunc The function to localize the string literals
 */
export function parseToStringLiteralTypeIfPossible<T extends string>(
  valueToParse: string,
  stringLiteralArray: readonly T[],
  localizationFunc?: (stringLit: T) => string
): T | undefined {
  // Parse value case insensitive
  const capitalValueToParse = valueToParse.toUpperCase();
  const match = stringLiteralArray.find(
    (stringLit) => stringLit.toUpperCase() === capitalValueToParse
  );
  if (match) {
    return match as T;
  }

  // Check for localized strings (case insensitive)
  if (localizationFunc) {
    for (const stringLit of stringLiteralArray) {
      const localizedNameUppercase = localizationFunc(stringLit)?.toUpperCase();
      if (localizedNameUppercase === capitalValueToParse) {
        return stringLit as T;
      }
    }
  }

  return undefined;
}

/**
 * Combines parse functions for fields
 * @param functionMap The map of field names to parse functions
 */
export function combineParseFunctionsForFields(
  functionMap?: Map<string | number | symbol, (value: string) => string>
): ((fieldName: string, value: string) => string) | undefined {
  if (!functionMap) {
    return undefined;
  }

  return (fieldName: string, value: string) => {
    if (functionMap.has(fieldName)) {
      const parseFunc = functionMap.get(fieldName);

      return parseFunc ? parseFunc(value) : value;
    }

    return value;
  };
}

/**
 * Parses the demand validation period type if possible, otherwise returns undefined
 * @param value The demand validation period type string to parse
 */
export function parseDemandValidationPeriodTypeIfPossible(
  value: string
): string | undefined {
  const uppercasedInput = value.toUpperCase();

  return (
    (['month', 'week'].find(
      (option) =>
        uppercasedInput ===
          translate(
            `validation_of_demand.upload_modal.paste.${option}`
          ).toUpperCase() ||
        uppercasedInput ===
          translate(
            `validation_of_demand.upload_modal.list.menu_item_${option}`
          ).toUpperCase()
    ) ||
      ['M', 'W'].find((option) => uppercasedInput === option)) ??
    value
  );
}
