import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import {
  ReplacementType,
  replacementTypeValues,
} from '../../feature/internal-material-replacement/model';
import {
  DemandCharacteristic,
  demandCharacteristics,
} from '../../feature/material-customer/model';

/**
 * Parses the date if possible, otherwise returns the original string
 * @param dateString The date string to parse
 * @param translocoLocaleService
 */
export function parseDateIfPossible(
  dateString: string,
  translocoLocaleService: TranslocoLocaleService
): string {
  // TODO check if this is ok if not declare a l10n service from l10n.ts file
  const parsed = translocoLocaleService.localizeDate(dateString, undefined, {
    dateStyle: 'short',
  });

  return parsed ?? dateString;
}

/**
 * Parses the demand characteristic if possible, otherwise returns the original string
 * @param value The demand characteristic string to parse
 */
export function parseDemandCharacteristicIfPossible(value: string): string {
  const localizationKeyCreation = (val: DemandCharacteristic) =>
    translate(`demand_characterictics.${val}`, {});
  const parsed = parseToStringLiteralTypeIfPossible<DemandCharacteristic>(
    value,
    demandCharacteristics,
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
    translate(`replacement_type.${val}`, {});
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
      const localizedNameUppercase = localizationFunc(stringLit).toUpperCase();
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
