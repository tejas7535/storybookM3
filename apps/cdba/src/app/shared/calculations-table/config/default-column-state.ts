import { ColumnState } from '@ag-grid-community/all-modules';

export const DEFAULT_COLUMN_STATE: { [key: string]: ColumnState } = {
  checkbox: { colId: 'checkbox', pinned: 'left' },
  materialNumber: {
    colId: 'materialNumber',
    pinned: 'left',
  },
  calculationDate: {
    colId: 'calculationDate',
  },
  costType: {
    colId: 'costType',
  },
  price: {
    colId: 'price',
  },
  currency: {
    colId: 'currency',
  },
  priceUnit: {
    colId: 'priceUnit',
  },
  plant: {
    colId: 'plant',
  },
  quantity: {
    colId: 'quantity',
  },
  lotSize: {
    colId: 'lotSize',
  },
  bomCostingVersion: {
    colId: 'bomCostingVersion',
  },
  rfqNumber: {
    colId: 'rfqNumber',
  },
};
