import { translate } from '@jsverse/transloco';

import { ValidationHelper } from './validation-helper';

// Helper to condense validations for max length and numbers
function validateMaxLengthAndNumbers(
  value: string,
  maxLength: number
): string[] | null {
  return ValidationHelper.condenseValidationResults([
    ValidationHelper.validateMaxLength(value, maxLength),
    ValidationHelper.validateForNumbers(value),
  ]);
}

// Helper to condense validations for exact length and letters
function validateExactLengthAndLetters(
  value: string,
  exactLength: number
): string[] | null {
  return ValidationHelper.condenseValidationResults([
    ValidationHelper.validateExactLength(value, exactLength),
    ValidationHelper.validateForLetters(value),
  ]);
}

export function validateSalesOrg(value: string): string[] | null {
  return validateMaxLengthAndNumbers(value, 4);
}

export function validateGkamNumber(value: string): string[] | null {
  return validateMaxLengthAndNumbers(value, 6);
}

export function validateCustomerNumber(value: string): string[] | null {
  return validateMaxLengthAndNumbers(value, 10);
}

export function validateMaterialNumber(value: string): string[] | null {
  const valueForChecking = value.replaceAll('-', '');

  return ValidationHelper.condenseValidationResults([
    ValidationHelper.validateExactLength(valueForChecking, 15),
    ValidationHelper.validateForNumbers(valueForChecking),
  ]);
}

export function validateSectors(value: string): string[] | null {
  const validLength = ValidationHelper.validateMaxLength(value, 4);
  const firstChar = value.startsWith('V')
    ? null
    : translate('error.sectorWrongBegin');
  const validNumber =
    ValidationHelper.validateForNumbers(value.slice(1)) === null
      ? null
      : translate('error.onlyValuesWithNumbers');

  return ValidationHelper.condenseValidationResults([
    validLength,
    firstChar,
    validNumber,
  ]);
}

export function validateProductionSegment(value: string): string[] | null {
  return validateMaxLengthAndNumbers(value, 6);
}

export function validateProductionPlants(value: string): string[] | null {
  return validateMaxLengthAndNumbers(value, 4);
}

export function validateAlertTypes(value: string): string[] | null {
  return validateExactLengthAndLetters(value, 6);
}

export function validateFor2Characters(value: string): string[] | null {
  return validateExactLengthAndLetters(value, 2);
}

export function validateForText(value: string): string[] | null {
  const validTypes = ValidationHelper.validateForLetters(value);

  return ValidationHelper.condenseValidationResults([validTypes]);
}
