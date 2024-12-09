import { translate } from '@jsverse/transloco';

import { ValidationHelper } from './validation-helper';

export function validateSalesOrg(value: string): string[] | null {
  const validLength = ValidationHelper.validateMaxLength(value, 4);
  const validTypes = ValidationHelper.validateForNumbers(value);

  return ValidationHelper.condenseValidationResults([validLength, validTypes]);
}

export function validateGkamNumber(value: string): string[] | null {
  const validLength = ValidationHelper.validateMaxLength(value, 6);
  const validTypes = ValidationHelper.validateForNumbers(value);

  return ValidationHelper.condenseValidationResults([validLength, validTypes]);
}

export function validateCustomerNumber(value: string): string[] | null {
  const validLength = ValidationHelper.validateMaxLength(value, 10);
  const validTypes = ValidationHelper.validateForNumbers(value);

  return ValidationHelper.condenseValidationResults([validLength, validTypes]);
}

export function validateMaterialNumber(value: string): string[] | null {
  const valueForChecking = value.replaceAll('-', '');
  const validExactLength = ValidationHelper.validateExactLength(
    valueForChecking,
    15
  );
  const validTypes = ValidationHelper.validateForNumbers(valueForChecking);

  return ValidationHelper.condenseValidationResults([
    validExactLength,
    validTypes,
  ]);
}

export function validateSectors(value: string): string[] | null {
  const validLength = ValidationHelper.validateMaxLength(value, 4);
  const firstChar =
    value[0] === 'V' ? null : translate('error.sectorWrongBegin');
  const validTypes = ValidationHelper.validateForNumbers(value.slice(1));

  return ValidationHelper.condenseValidationResults([
    validLength,
    firstChar,
    validTypes,
  ]);
}

export function validateProductionSegment(value: string): string[] | null {
  const validLength = ValidationHelper.validateMaxLength(value, 6);
  const validTypes = ValidationHelper.validateForNumbers(value);

  return ValidationHelper.condenseValidationResults([validLength, validTypes]);
}

export function validateProductionPlants(value: string): string[] | null {
  const validLength = ValidationHelper.validateMaxLength(value, 4);
  const validTypes = ValidationHelper.validateForNumbers(value);

  return ValidationHelper.condenseValidationResults([validLength, validTypes]);
}

export function validateAlertTypes(value: string): string[] | null {
  const validLength = ValidationHelper.validateExactLength(value, 6);
  const validTypes = ValidationHelper.validateForLetters(value);

  return ValidationHelper.condenseValidationResults([validLength, validTypes]);
}

export function validateFor2Characters(value: string): string[] | null {
  const validLength = ValidationHelper.validateExactLength(value, 2);
  const validTypes = ValidationHelper.validateForLetters(value);

  return ValidationHelper.condenseValidationResults([validLength, validTypes]);
}

export function validateForText(value: string): string[] | null {
  const validTypes = ValidationHelper.validateForLetters(value);

  return ValidationHelper.condenseValidationResults([validTypes]);
}
