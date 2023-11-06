// list of error codes
export enum ErrorCode {
  MISSING_MANDATORY_COLUMN = 'missingColumn',
  INVALID_VALUE = 'invalidValue',
  INVALID_PCF_VALUE = 'invalidPcfValue',
  NO_PCF_VALUE = 'missingPcfValue',
}

// Validation result
export class ValidationError {
  errorCode: ErrorCode;
  params: { [id: string]: string | number };

  constructor(errorCode: ErrorCode, params: { [id: string]: string | number }) {
    this.errorCode = errorCode;
    this.params = params;
  }
}

// List of mandatory columns
export const MANDATORY_COLUMNS = [
  'materialNumber',
  'materialDescription',
  'plant',
  'category',
  'materialGroup',
  'businessPartnerId',
  'supplierId',
  'supplierCountry',
  'supplierRegion',
  'emissionFactorKg',
  'emissionFactorPc',
  'dataComment',
];

// List of valid columns
export const VALID_COLUMNS = [...MANDATORY_COLUMNS];

// List of column rules
export const COLUMN_RULES: { [id: string]: RegExp } = {
  materialNumber: /^\d{9}(-\d{4}(-\d{2})?)?$/,
  plant: /^\d{4}$/,
  category: /^\w{4}$/,
  materialGroup: /^M?\d+$/,
  businessPartnerId: /^\d{5,7}$/,
  supplierId: /^S\d{9}$/,
  supplierCountry: /^\w{2}$/,
  supplierRegion: /^\w{2}$/,
};
