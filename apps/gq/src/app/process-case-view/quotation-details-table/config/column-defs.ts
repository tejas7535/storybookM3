import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

export const COLUMN_DEFS: ColDef[] = [
  {
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    cellRenderer: 'infoCellComponent',
    headerName: '',
    field: 'info',
    pinned: 'left',
    initialWidth: 120,
    suppressMenu: true,
    filter: false,
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.item'),
    field: 'positionNumber',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.materialNumber'
    ),
    field: 'materialNumber15',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.materialDescription'
    ),
    field: 'materialDesignation',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.quantity'),
    field: 'orderQuantity',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.offerPrice'),
    field: 'rsp',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.currency'),
    field: 'unit',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.per'),
    field: 'per',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.uom'),
    field: 'priceUnit',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.netValue'),
    field: 'netValue',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.priceSource'),
    field: 'priceSource',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gqRating'),
    field: 'gqRating',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gpc'),
    field: 'gpc',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.sqv'),
    field: 'sqv',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gpi'),
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
    headerName: translate('processCaseView.quotationDetailsTable.rlt'),
    field: 'rlt',
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
    headerName: translate(
      'processCaseView.quotationDetailsTable.productionCountry'
    ),
    field: 'productionCountry',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.productLine'),
    field: 'productLine',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gspd'),
    field: 'gspd',
  },
];
