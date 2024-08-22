import { SAP_ERROR_MESSAGE_CODE } from '../quotation-detail';
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
  info?: {
    valid: boolean;
    description: ValidationDescription[];
    errorCodes?: SAP_ERROR_MESSAGE_CODE[];
  };
}
