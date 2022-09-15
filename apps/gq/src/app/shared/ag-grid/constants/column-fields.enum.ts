export enum ColumnFields {
  MATERIAL_NUMBER_15 = 'material.materialNumber15',
  UOM = 'material.baseUoM',
  GPI = 'gpi',
  PROFIT_MARGIN = 'profitMargin',
  GPM = 'gpm',
  RLM = 'rlm',
  PRICE_UNIT = 'priceUnit',
  PRICE = 'price',
  PRICE_SOURCE = 'priceSource',
  NET_VALUE = 'netValue',
  ORDER_QUANTITY = 'orderQuantity',
  GPC = 'gpc',
  SQV = 'sqv',
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
  DATE_NEXT_FREE_ATP = 'materialStockByPlant.dateNextFree',
  STRATEGIC_MATERIAL = 'strategicMaterial',
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

export const ChinaSpecificColumns = [ColumnFields.STRATEGIC_MATERIAL];
