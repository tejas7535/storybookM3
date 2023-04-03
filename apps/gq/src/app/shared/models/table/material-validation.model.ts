import { SAP_ERROR_MESSAGE_CODE } from '../quotation-detail/sap-error-message-code.enum';

export interface MaterialValidation {
  materialDescription: string;
  materialNumber15: string;
  valid: boolean;
  errorCode?: SAP_ERROR_MESSAGE_CODE;
}
