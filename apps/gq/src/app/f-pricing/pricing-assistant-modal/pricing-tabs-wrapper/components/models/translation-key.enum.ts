/**
  key for the translation of the table to check for the columnHeader translation  
  will be used in the simple-table component
  translations need than to be placed in the translation file under the key:

  fPricing.pricingAssistantModal.KEY:{
  "description":"VALUE",
  "selectedValue":"VALUE",
  "value":"VALUE",
  "additionalDescription":"VALUE"

}
 */

export enum TranslationKey {
  TECHNICAL_VALUE_DRIVER = 'technicalValueDrivers.tableColumnHeader',
  SANITY_CHECKS = 'sanityChecks.tableColumnHeader',
}
