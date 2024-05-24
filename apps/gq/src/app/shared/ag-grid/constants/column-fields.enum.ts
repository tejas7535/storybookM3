export enum ColumnFields {
  QUOTATION_ITEM_ID = 'quotationItemId',
  MATERIAL_NUMBER_15 = 'material.materialNumber15',
  MATERIAL_DESCRIPTION = 'material.materialDescription',
  SAP_STATUS = 'syncInSap',
  UOM = 'material.baseUoM',
  GPI = 'gpi',
  PROFIT_MARGIN = 'profitMargin',
  GPM = 'gpm',
  GPM_RFQ = 'gpmRfq',
  ABCX_CLASSIFICATION = 'abcxClassification',
  RLM = 'rlm',
  PRICE_UNIT = 'priceUnit',
  PRICE = 'price',
  PRICE_SOURCE = 'priceSource',
  PRICING_ASSISTANT = 'pricingAssistant',
  NET_VALUE = 'netValue',
  ORDER_QUANTITY = 'orderQuantity',
  GPC = 'gpc',
  SQV = 'sqv',
  SQV_RFQ = 'rfqData.sqv',
  RELOCATION_COST = 'relocationCost',
  LAST_CUSTOMER_PRICE = 'lastCustomerPrice',
  LAST_CUSTOMER_PRICE_QUANTITY = 'lastCustomerPriceQuantity',
  LAST_CUSTOMER_PRICE_GPI = 'lastCustomerPriceGpi',
  LAST_CUSTOMER_PRICE_GPM = 'lastCustomerPriceGpm',
  LAST_CUSTOMER_PRICE_DATE = 'lastCustomerPriceDate',
  LAST_CUSTOMER_PRICE_CONDITION = 'lastCustomerPriceCondition',
  LAST_OFFER_PRICE = 'lastOfferDetail.lastOfferPrice',
  LAST_OFFER_PRICE_DATE = 'lastOfferDetail.lastOfferDate',
  LAST_OFFER_QUANTITY = 'lastOfferDetail.positionQuantity',
  FOLLOWING_TYPE = 'material.followingType',
  DISCOUNT = 'discount',
  INPUT_QUANTITY = 'inputQuantity',
  RSP = 'rsp',
  MSP = 'msp',
  SAP_GROSS_PRICE = 'sapGrossPrice',
  SAP_PRICE = 'sapPrice',
  RECOMMENDED_PRICE = 'recommendedPrice',
  PRICE_DIFF = 'priceDiff',
  NEXT_FREE_ATP = 'materialStockByPlant.nextFree',
  DATE_NEXT_FREE_ATP = 'materialStockByPlant.dateNextFree',
  STRATEGIC_MATERIAL = 'strategicMaterial',
  STRATEGIC_HIERARCHY = 'material.strategicHierarchy',
  STRATEGIC_PL = 'material.strategicPL',
  SAP_VOLUME_SCALE = 'sapVolumeScale',
  TARGET_PRICE = 'targetPrice',
  DELIVERY_UNIT = 'deliveryUnit',
  SAP_PRICE_UNIT = 'sapPriceUnit',
}

export enum SapPriceDetailsColumnFields {
  SAP_SEQUENCE_ID = 'sequenceId',
  SAP_CONDITION_TYPE = 'sapConditionType',
  SAP_CONDITION_DESCRIPTION = 'conditionTypeDescription',
  SAP_AMOUNT = 'amount',
  SAP_PRICING_UNIT = 'pricingUnit',
  SAP_CONDITION_UNIT = 'conditionUnit',
  SAP_CONDITION_VALUE = 'conditionValue',
  SAP_VALID_TO = 'validTo',
}

export enum CaseTableColumnFields {
  GQ_ID = 'gqId',
  GQ_CREATED = 'gqCreated',
  GQ_CREATED_BY = 'gqCreatedByUser.name',
  SAP_SYNC_STATUS = 'sapSyncStatus',
  STATUS = 'status',
  CASE_NAME = 'caseName',
  SAP_ID = 'sapId',
  SAP_CREATED_BY = 'sapCreatedByUser.name',
  CUSTOMER_NUMBER = 'customerIdentifiers.customerId',
  CUSTOMER_NAME = 'customerName',
  LAST_UPDATED = 'gqLastUpdated',
  CASE_ORIGIN = 'origin',
}

export enum MaterialColumnFields {
  MATERIAL = 'materialNumber',
  MATERIAL_DESCRIPTION = 'materialDescription',
  QUANTITY = 'quantity',
  INFO = 'info',
  TARGET_PRICE = 'targetPrice',
}

export enum ReferencePricingColumnFields {
  IS_SHOW_MORE_ROW = 'isShowMoreRow',
  PARENT_MATERIAL_NUMBER = 'parentMaterialNumber',
  PARENT_MATERIAL_DESCRIPTION = 'parentMaterialDescription',
  CUSTOMER_NAME = 'customerName',
  MATERIAL_NUMBER = 'materialNumber',
  MATERIAL_DESCRIPTION = 'materialDescription',
  QUANTITY = 'quantity',
  PRICE = 'price',
  YEAR = 'year',
}

export enum SearchByCasesOrMaterialsColumnFields {
  GQ_ID = 'gqId',
  SAP_ID = 'sapId',
  CUSTOMER_NAME = 'customerName',
  CUSTOMER_ID = 'customerId',
  GQ_CREATED_BY = 'gqCreatedByUser',
  GQ_CREATED = 'gqCreated', // equals createdOn date
  GQ_LAST_UPDATED = 'gqLastUpdated',
  TOTAL_NET_VALUE = 'totalNetValue',
  MATERIAL_NUMBER_15 = 'materialNumber15',
  MATERIAL_DESCRIPTION = 'materialDescription',
  CUSTOMER_MATERIAL = 'customerMaterial',
  QUANTITY = 'quantity',
  PRICE = 'price',
  GPI = 'gpi',
  CURRENCY = 'currency',
}

export const PriceColumns = [
  ColumnFields.PRICE,
  ColumnFields.NET_VALUE,
  ColumnFields.GPC,
  ColumnFields.SQV,
  ColumnFields.LAST_CUSTOMER_PRICE,
  ColumnFields.RELOCATION_COST,
  ColumnFields.RSP,
  ColumnFields.MSP,
  ColumnFields.SAP_GROSS_PRICE,
  ColumnFields.SAP_PRICE,
  ColumnFields.RECOMMENDED_PRICE,
  SapPriceDetailsColumnFields.SAP_CONDITION_VALUE,
];

export const PercentColumns = [
  ColumnFields.PROFIT_MARGIN,
  ColumnFields.GPI,
  ColumnFields.GPM,
  ColumnFields.RLM,
  ColumnFields.PRICE_DIFF,
  ColumnFields.LAST_CUSTOMER_PRICE_GPI,
  ColumnFields.LAST_CUSTOMER_PRICE_GPM,
  ColumnFields.SAP_VOLUME_SCALE,
];

export const DateColumns = [SapPriceDetailsColumnFields.SAP_VALID_TO];

export const ExportExcelNumberColumns = [
  ...PriceColumns,
  ...PercentColumns,
  ColumnFields.INPUT_QUANTITY,
];

// list of related and editable KPIs
export const RelatedKPIs = [
  ColumnFields.PRICE,
  ColumnFields.GPI,
  ColumnFields.GPM,
  ColumnFields.DISCOUNT,
];

export const SqvColumns = [
  ColumnFields.SQV,
  ColumnFields.GPM,
  ColumnFields.RELOCATION_COST,
  ColumnFields.RLM,
  ColumnFields.LAST_CUSTOMER_PRICE_GPM,
];

export const GpcColumns = [
  ColumnFields.GPC,
  ColumnFields.GPI,
  ColumnFields.LAST_CUSTOMER_PRICE_GPI,
];

export const ChinaSpecificColumns = [
  ColumnFields.STRATEGIC_MATERIAL,
  ColumnFields.STRATEGIC_HIERARCHY,
  ColumnFields.STRATEGIC_PL,
];
