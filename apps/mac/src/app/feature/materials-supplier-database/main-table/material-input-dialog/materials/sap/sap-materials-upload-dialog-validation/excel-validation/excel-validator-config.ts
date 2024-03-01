import * as columns from '@mac/feature/materials-supplier-database/constants';

// Mapping: Excel header labels to data fields
export const COLUMN_HEADER_FIELD = [
  columns.MATERIAL_NUMBER,
  columns.MATERIAL_DESCRIPTION,
  columns.RECYCLED_MATERIAL_SHARE,
  columns.SECONDARY_MATERIAL_SHARE,
  columns.CATEGORY,
  columns.MATERIAL_GROUP,
  columns.DATA_COMMENT,
  columns.BUSINESS_PARTNER_ID,
  columns.SUPPLIER_ID,
  columns.RAW_MATERIAL_MANUFACTURER,
  columns.INCOTERMS,
  columns.SUPPLIER_LOCATION,
  columns.PLANT,
  columns.SUPPLIER_COUNTRY,
  columns.SUPPLIER_REGION,
  columns.FOSSIL_ENERGY_SHARE,
  columns.NUCLEAR_ENERGY_SHARE,
  columns.RENEWABLE_ENERGY_SHARE,
  columns.ONLY_RENEWABLE_ELECTRICITY,
  columns.VALID_FROM,
  columns.VALID_UNTIL,
  columns.PRIMARY_DATA_SHARE,
  columns.DQR_PRIMARY,
  columns.DQR_SECONDARY,
  columns.SECONDARY_DATA_SOURCES,
  columns.CROSS_SECTORAL_STANDARDS_USED,
  columns.CUSTOMER_CALCULATION_METHOD_APPLIED,
  columns.LINK_TO_CUSTOMER_CALCULATION_METHOD,
  columns.CALCULATION_METHOD_VERIFIED_BY_3RD_PARTY,
  columns.LINK_TO_3RD_PARTY_VERIFICATION_PROOF,
  columns.PCF_VERIFIED_BY_3RD_PARTY,
  columns.EMISSION_FACTOR_KG,
  columns.EMISSION_FACTOR_PC,
  columns.PCF_LOGISTICS,
  columns.SERVICE_INPUT_GROSS_WEIGHT,
  columns.NET_WEIGHT,
  columns.WEIGHT_DATA_SOURCE,
  columns.MATERIAL_UTILIZATION_FACTOR,
  columns.MATERIAL_GROUP_OF_RAW_MATERIAL,
  columns.RAW_MATERIAL_EMISSION_FACTOR,
  columns.PROCESS_SURCHARGE,
  columns.RAW_MATERIAL,
  columns.DIRECT_SUPPLIER_EMISSIONS,
  columns.INDIRECT_SUPPLIER_EMISSIONS,
  columns.UPSTREAM_EMISSIONS,
];

// list of error codes
export enum ErrorCode {
  MISSING_MANDATORY_COLUMN = 'missingColumn',
  MISSING_MANDATORY_VALUE = 'missingValue',
  INVALID_VALUE = 'invalidValue',
  INVALID_PCF_VALUE = 'invalidPcfValue',
  NO_PCF_VALUE = 'missingPcfValue',
  INVALID_PCF_SUPPLIER_EMISSIONS = 'invalidPcfSupplierEmissions',
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
  columns.MATERIAL_NUMBER,
  columns.MATERIAL_DESCRIPTION,
  columns.PLANT,
  columns.CATEGORY,
  columns.MATERIAL_GROUP,
  columns.BUSINESS_PARTNER_ID,
  columns.SUPPLIER_ID,
  columns.SUPPLIER_COUNTRY,
  columns.SUPPLIER_REGION,
];

const URL_REG_EXP =
  /^https?:\/\/(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,4}\b([\w#%&+./:=?@~-]*)$/;

// List of column rules
export const COLUMN_RULES: { [id: string]: RegExp } = {
  [columns.MATERIAL_NUMBER]: /^\d{9}(-\d{4}(-\d{2})?)?$/,
  [columns.PLANT]: /^\d{1,4}$/,
  [columns.CATEGORY]: /^\w{4}$/,
  [columns.BUSINESS_PARTNER_ID]: /^\d{5,7}$/,
  [columns.SUPPLIER_ID]: /^S\d{9}$/,
  [columns.SUPPLIER_COUNTRY]: /^\w{2}$/,
  [columns.SUPPLIER_REGION]: /^\w{2}$/,
  [columns.LINK_TO_CUSTOMER_CALCULATION_METHOD]: URL_REG_EXP,
  [columns.LINK_TO_3RD_PARTY_VERIFICATION_PROOF]: URL_REG_EXP,
};
