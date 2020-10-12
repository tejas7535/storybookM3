import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

export const COLUMN_DEFS: ColDef[] = [
  {
    checkboxSelection: true,
    pinned: 'left',
    filter: false,
    resizable: false,
    suppressMenu: true,
    width: 30,
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.materialDescription'
    ),
    field: 'materialDescription',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.materialNumber'
    ),
    field: 'materialNumber',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.productionHierarchy'
    ),
    field: 'productionHierarchy',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.productionCost'
    ),
    field: 'productionCost',
  },

  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.productionPlant'
    ),
    field: 'productionPlant',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.plantCity'),
    field: 'plantCity',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.plantCountry'),
    field: 'plantCountry',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.rsp'),
    field: 'rsp',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.info'),
    field: 'info',
  },
];
