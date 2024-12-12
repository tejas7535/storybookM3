import { Severity } from '@gq/shared/services/rest/material/models/add-details-validation-response.interface';

import { VALIDATION_CODE } from './customer-validation-info.enum';
import { ValidationDescription } from './validation-description.enum';

export class MaterialTableItem {
  id?: number;
  materialDescription?: string;
  materialNumber?: string;
  customerMaterialNumber?: string;
  quantity?: number;
  targetPrice?: number;
  targetPriceSource?: string;
  priceUnit?: number;
  UoM?: string;
  currency?: string;
  deliveryUnit?: number;
  info?: {
    valid: boolean;
    description: ValidationDescription[];
    codes?: VALIDATION_CODE[];
    severity?: Severity;
  };
}
