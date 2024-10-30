import {
  condenseValidationResults,
  validateExactLength,
  validateForNumbers,
  validateMaxLength,
} from './validation-helper';

export function validateSalesOrg(value: string): string[] | null {
  const validLength = validateMaxLength(value, 4);
  const validTypes = validateForNumbers(value);

  return condenseValidationResults([validLength, validTypes]);
}

export function validateGkamNumber(value: string): string[] | null {
  const validLength = validateMaxLength(value, 6);
  const validTypes = validateForNumbers(value);

  return condenseValidationResults([validLength, validTypes]);
}

export function validateCustomerNumber(value: string): string[] | null {
  const validLength = validateMaxLength(value, 10);
  const validTypes = validateForNumbers(value);

  return condenseValidationResults([validLength, validTypes]);
}

export function validateMaterialNumber(value: string): string[] | null {
  const valueForChecking = value.replaceAll('-', '');
  const validExactLength = validateExactLength(valueForChecking, 15);
  const validTypes = validateForNumbers(valueForChecking);

  return condenseValidationResults([validExactLength, validTypes]);
}

export function validateSectors(value: string): string[] | null {
  const validLength = validateMaxLength(value, 4);
  const firstChar = value[0] === 'V' ? null : 'error.sectorWrongBegin';
  const validTypes = validateForNumbers(value.slice(1));

  return condenseValidationResults([validLength, firstChar, validTypes]);
}

export function validateProductionSegment(value: string): string[] | null {
  const validLength = validateMaxLength(value, 6);
  const validTypes = validateForNumbers(value);

  return condenseValidationResults([validLength, validTypes]);
}

export function validateProductionPlants(value: string): string[] | null {
  const validLength = validateMaxLength(value, 4);
  const validTypes = validateForNumbers(value);

  return condenseValidationResults([validLength, validTypes]);
}
