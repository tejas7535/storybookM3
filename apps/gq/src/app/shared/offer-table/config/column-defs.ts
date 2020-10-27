import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

export const COLUMN_DEFS_SHORT: ColDef[] = [
  {
    checkboxSelection: true,
    pinned: 'left',
    filter: false,
    resizable: false,
    suppressMenu: true,
    width: 30,
  },
  {
    headerName: translate('shared.offerTable.materialNumber'),
    field: 'materialNumber13',
  },
  {
    headerName: translate('shared.offerTable.price'),
    field: 'price',
  },
  {
    headerName: translate('shared.offerTable.quantity'),
    field: 'orderQuantity',
  },
];

export const COLUMN_DEFS_LONG: ColDef[] = [
  {
    checkboxSelection: true,
    pinned: 'left',
    filter: false,
    resizable: false,
    suppressMenu: true,
    width: 30,
  },
  {
    headerName: translate('shared.offerTable.materialNumber'),
    field: 'materialNumber13',
  },
  {
    headerName: translate('shared.offerTable.price'),
    field: 'price',
  },
  {
    headerName: translate('shared.offerTable.quantity'),
    field: 'orderQuantity',
  },
];
