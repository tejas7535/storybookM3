import { SAP_ERROR_MESSAGE_CODE } from '../quotation-detail';
import { ValidationDescription } from './validation-description.enum';

export class MaterialTableItem {
  id?: number;
  materialDescription?: string;
  materialNumber?: string;
  quantity?: number;
  targetPrice?: number;
  info?: {
    valid: boolean;
    description: ValidationDescription[];
    errorCode?: SAP_ERROR_MESSAGE_CODE;
  };
}
