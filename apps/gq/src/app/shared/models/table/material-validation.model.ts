import { ValidationCode } from '@gq/shared/services/rest/material/models/add-details-validation-response.interface';

export interface MaterialValidation {
  id: number;
  materialNumber15: string;
  valid: boolean;
  deliveryUnit?: number;
  correctedQuantity?: number;
  materialDescription?: string;
  materialPriceUnit?: number;
  materialUoM?: string;
  customerMaterial?: string;
  validationCodes?: ValidationCode[];
}
