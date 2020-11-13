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
      'processCaseView.quotationDetailsTable.positionNumber'
    ),
    field: 'positionNumber',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.materialDescription'
    ),
    field: 'materialDesignation',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.materialNumber'
    ),
    field: 'materialNumber15',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.quantity'),
    field: 'orderQuantity',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.unit'),
    field: 'unit',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.priceUnit'),
    field: 'priceUnit',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.recommendedUnitPriceInCurrency'
    ),
    field: 'rsp',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.priceSource'),
    field: 'priceSource',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.margin'),
    field: 'margin',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.lastCustomerPrice'
    ),
    field: 'lastCustomerPrice',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.percentDifference'
    ),
    field: 'percentDifference',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.priceRating'),
    field: 'priceRating',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.netValue'),
    field: 'netValue',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.rlt'),
    field: 'rlt',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.productLine'),
    field: 'productLine',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gspd'),
    field: 'gspd',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.productionPlant'
    ),
    field: 'productionPlant',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.productionCity'
    ),
    field: 'productionCity',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.info'),
    cellRenderer: 'infoCellComponent',
    field: 'info',
  },
];
