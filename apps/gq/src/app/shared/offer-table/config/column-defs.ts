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

export const COLUMN_DEFS_FINISH_OFFER: ColDef[] = [
  {
    checkboxSelection: true,
    pinned: 'left',
    filter: false,
    resizable: false,
    suppressMenu: true,
    width: 30,
  },
  {
    headerName: translate('shared.offerTable.materialDescription'),
    field: 'materialDesignation',
  },
  {
    headerName: translate('shared.offerTable.materialNumber'),
    field: 'materialNumber13',
  },
  {
    headerName: translate('shared.offerTable.productionHierarchy'),
    field: 'productionHierarchy',
  },
  {
    headerName: translate('shared.offerTable.productionCost'),
    field: 'productionCost',
  },

  {
    headerName: translate('shared.offerTable.productionPlant'),
    field: 'productionPlant',
  },
  {
    headerName: translate('shared.offerTable.plantCity'),
    field: 'plantCity',
  },
  {
    headerName: translate('shared.offerTable.plantCountry'),
    field: 'plantCountry',
  },
  {
    headerName: translate('shared.offerTable.rsp'),
    field: 'rsp',
  },
  {
    headerName: translate('shared.offerTable.info'),
    field: 'info',
  },
];
