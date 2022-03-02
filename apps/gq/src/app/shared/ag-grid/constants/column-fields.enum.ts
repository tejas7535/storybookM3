export enum ColumnFields {
  MATERIAL_NUMBER_15 = 'material.materialNumber15',
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
  LAST_CUSTOMER_PRICE_DATE = 'lastCustomerPriceDate',
  LAST_OFFER_PRICE = 'lastOfferDetail.lastOfferPrice',
  LAST_OFFER_PRICE_DATE = 'lastOfferDetail.lastOfferDate',
  FOLLOWING_TYPE = 'material.followingType',
  DISCOUNT = 'discount',
  INPUT_QUANTITY = 'inputQuantity',
  QUANTITY = 'quantity',
  RSP = 'rsp',
  MSP = 'msp',
  SAP_GROSS_PRICE = 'sapGrossPrice',
  SAP_PRICE = 'sapPrice',
  RECOMMENDED_PRICE = 'recommendedPrice',
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
];

export const PercentColumns = [
  ColumnFields.PROFIT_MARGIN,
  ColumnFields.GPI,
  ColumnFields.GPM,
  ColumnFields.RLM,
];

export const ExportExcelNumberColumns = [
  ...PriceColumns,
  ...PercentColumns,
  ColumnFields.QUANTITY,
  ColumnFields.INPUT_QUANTITY,
];
