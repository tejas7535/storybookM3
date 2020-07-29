import { ColumnState } from '../column-state';

export const DEFAULT_COLUMN_STATE: { [key: string]: ColumnState } = {
  checkbox: { colId: 'checkbox', pinned: 'left' },
  materialNum: {
    colId: 'materialNum',
    pinned: 'left',
  },
  costingDateFrom: {
    colId: 'costingDateFrom',
  },
  costingVariant: {
    colId: 'costingVariant',
  },
  priceEur: {
    colId: 'priceEur',
  },
  priceEurCurrency: {
    colId: 'priceEurCurrency',
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
};
