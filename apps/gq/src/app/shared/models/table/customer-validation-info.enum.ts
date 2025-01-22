import { SAP_ERROR_MESSAGE_CODE } from '../quotation-detail';

// find explanation for this enum within apps\gq\src\assets\i18n\en.json caseMaterial.table.customerValidation
enum CustomerValidationInfo {
  QDV001 = 'QDV001', // Quantity adjusted per Delivery Unit
  QDV002 = 'QDV002', // Several Customer Materials available
  QDV003 = 'QDV003', // Several Material Numbers available
}

export enum VALIDATION_CODE {
  SDG101 = SAP_ERROR_MESSAGE_CODE.SDG101,
  SDG102 = SAP_ERROR_MESSAGE_CODE.SDG102,
  SDG103 = SAP_ERROR_MESSAGE_CODE.SDG103,
  SDG104 = SAP_ERROR_MESSAGE_CODE.SDG104,
  QDV001 = CustomerValidationInfo.QDV001,
  QDV002 = CustomerValidationInfo.QDV002,
  QDV003 = CustomerValidationInfo.QDV003,
}
