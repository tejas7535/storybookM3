export enum ColumnFields {
  MATERIAL_NUMBER_15 = 'material.materialNumber15',
  ADDED_TO_OFFER = 'addedToOffer',
  GPI = 'gpi',
  PER = 'per',
  PRICE = 'price',
  NET_VALUE = 'netValue',
  ORDER_QUANTITY = 'orderQuantity',
  GPC = 'gpc',
  SQV = 'sqv',
  LAST_CUSTOMER_PRICE = 'lastCustomerPrice',
}

export const PriceColumns = [
  ColumnFields.PRICE,
  ColumnFields.NET_VALUE,
  ColumnFields.GPC,
  ColumnFields.SQV,
  ColumnFields.LAST_CUSTOMER_PRICE,
];
