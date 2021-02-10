import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { NumberFormatPipe } from '../../../shared/pipes/number-format.pipe';
import { ColumnFields } from './column-fields.enum';

export const numberFormatter = (data: any) => {
  const pipe = new NumberFormatPipe();

  return pipe.transform(data.value, data.column.colId);
};

export const percentageFormatter = (data: any) => {
  return data.value ? `${data.value} %` : '';
};

export const COLUMN_DEFS: ColDef[] = [
  {
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    cellRenderer: 'infoCellComponent',
    headerName: '',
    field: ColumnFields.ADDED_TO_OFFER,
    pinned: 'left',
    initialWidth: 120,
    suppressMenu: true,
    filter: false,
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.item'),
    field: 'sapQuotationItemId',
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
    field: 'materialDescription',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.orderQuantity'
    ),
    field: 'orderQuantity',
    valueFormatter: numberFormatter,
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.offerPrice'),
    field: 'price',
    valueFormatter: numberFormatter,
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.currency'),
    // TODO: use currency from quotation ?
    field: 'unit',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.per'),
    // TODO: where does this column come from ?
    field: 'per',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.uom'),
    // where does this come from??
    field: 'priceUnit',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.netValue'),
    // where does this come from ?
    field: 'netValue',
    valueFormatter: numberFormatter,
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.priceSource'),
    // currently missing in the database ?
    field: 'priceSource',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gqRating'),
    // currently missing in the database ?
    field: 'gqRating',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gpc'),
    field: ColumnFields.GPC,
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.sqv'),
    field: ColumnFields.SQV,
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gpi'),
    // where does this come from?
    field: ColumnFields.GPI,
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
    valueFormatter: percentageFormatter,
  },

  {
    headerName: translate('processCaseView.quotationDetailsTable.rlt'),
    field: 'rlt',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.productionPlant'
    ),
    field: 'productionPlant.plantNumber',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.productionCity'
    ),
    // currently missing in the database -> BE: adjust PlantDto
    field: 'productionCity',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.productionCountry'
    ),
    // currently missing in the database -> BE: adjust PlantDto
    field: 'productionCountry',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.productLine'),
    // currently missing in the database
    field: 'productLine',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gspd'),
    // currently missing in the database
    field: 'gspd',
  },
];
