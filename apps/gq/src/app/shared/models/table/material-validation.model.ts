import { SAP_ERROR_MESSAGE_CODE } from '../quotation-detail/sap-error-message-code.enum';

export interface MaterialValidation {
  materialNumber15: string;
  valid: boolean;
  materialDescription?: string;
  materialPriceUnit?: number;
  materialUoM?: string;
  errorCode?: SAP_ERROR_MESSAGE_CODE;
}
