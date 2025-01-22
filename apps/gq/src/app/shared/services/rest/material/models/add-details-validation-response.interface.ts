import { CustomerId } from '@gq/shared/models';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { VALIDATION_CODE } from '@gq/shared/models/table';

export interface AddDetailsValidationResponse {
  customerId: CustomerId;
  validatedDetails: ValidatedDetail[];
}

export interface ValidatedDetail {
  id: number;
  valid: boolean;
  userInput: ValidatedDetailUserInput;
  materialData: ValidatedDetailMaterialData;
  validationCodes: ValidationCode[];
  customerData?: ValidatedDetailCustomerData;
}

export interface ValidatedDetailUserInput {
  materialNumber15: string;
  quantity: number;
  customerMaterial?: string;
  targetPrice?: number;
  targetPriceSource?: TargetPriceSource;
  customerId?: string;
  salesOrg?: string;
}

export interface ValidatedDetailMaterialData {
  materialNumber15: string;
  materialDescription: string;
  materialPriceUnit: number;
  materialUoM: string;
}

export interface ValidatedDetailCustomerData {
  customerMaterial: string;
  deliveryUnit: number;
  correctedQuantity: number;
  targetPrice?: number;
  targetPriceSource?: TargetPriceSource;
}

export interface ValidationCode {
  code: VALIDATION_CODE;
  description: string;
  severity: Severity;
}

export enum Severity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}
