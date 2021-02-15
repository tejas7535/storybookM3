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
    cellRenderer: 'offerCartCellComponent',
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
    field: 'material.materialNumber15',
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.materialDescription'
    ),
    field: 'material.materialDescription',
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
    field: 'unit',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.per'),
    valueFormatter: () => '1',
    field: 'per',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.uom'),
    field: 'material.baseUoM',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.netValue'),
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
    cellRenderer: 'gqRatingComponent',
    field: 'gqRating',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gpc'),
    field: ColumnFields.GPC,
    valueFormatter: numberFormatter,
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.sqv'),
    field: ColumnFields.SQV,
    valueFormatter: numberFormatter,
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gpi'),
    field: ColumnFields.GPI,
    valueFormatter: percentageFormatter,
  },
  {
    headerName: translate(
      'processCaseView.quotationDetailsTable.lastCustomerPrice'
    ),
    field: 'lastCustomerPrice',
    valueFormatter: numberFormatter,
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
    field: 'material.productLineId',
  },
  {
    headerName: translate('processCaseView.quotationDetailsTable.gpsd'),
    field: 'material.gpsdGroupId',
  },
];
