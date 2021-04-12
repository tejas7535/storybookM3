import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { ColumnFields } from './column-fields.enum';
import { ColumnUtilityService } from './column-utility.service';

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
    headerName: translate('shared.quotationDetailsTable.item'),
    field: 'sapQuotationItemId',
    sort: 'asc',
  },
  {
    headerName: translate('shared.quotationDetailsTable.materialNumber'),
    field: ColumnFields.MATERIAL_NUMBER_15,
    valueFormatter: ColumnUtilityService.transformMaterial,
  },
  {
    headerName: translate('shared.quotationDetailsTable.materialDescription'),
    field: 'material.materialDescription',
  },
  {
    headerName: translate('shared.quotationDetailsTable.orderQuantity'),
    field: ColumnFields.ORDER_QUANTITY,
    valueFormatter: ColumnUtilityService.numberFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.offerPrice'),
    field: ColumnFields.PRICE,
    valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.per'),
    // ToDo: Adjust when per column is defined in datasources
    valueFormatter: ColumnUtilityService.transformPer,
    field: 'per',
  },
  {
    headerName: translate('shared.quotationDetailsTable.uom'),
    field: 'material.baseUoM',
  },
  {
    headerName: translate('shared.quotationDetailsTable.netValue'),
    field: ColumnFields.NET_VALUE,
    valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.priceSource'),
    // currently missing in the database ?
    field: 'priceSource',
    valueFormatter: ColumnUtilityService.basicTransform,
  },
  {
    headerName: translate('shared.quotationDetailsTable.gqRating'),
    cellRenderer: 'gqRatingComponent',
    field: 'gqRating',
  },
  {
    headerName: translate('shared.quotationDetailsTable.gpc'),
    field: ColumnFields.GPC,
    valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.sqv'),
    field: ColumnFields.SQV,
    valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.gpi'),
    field: ColumnFields.GPI,
    valueFormatter: ColumnUtilityService.percentageFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.lastCustomerPrice'),
    field: ColumnFields.LAST_CUSTOMER_PRICE,
    valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.percentDifference'),
    field: 'percentDifference',
    valueFormatter: ColumnUtilityService.percentageFormatter,
  },

  {
    headerName: translate('shared.quotationDetailsTable.rlt'),
    field: 'rlt',
    valueFormatter: ColumnUtilityService.basicTransform,
  },
  {
    headerName: translate('shared.quotationDetailsTable.productionPlant'),
    field: 'productionPlant.plantNumber',
    valueFormatter: ColumnUtilityService.basicTransform,
  },
  {
    headerName: translate('shared.quotationDetailsTable.productionCity'),
    field: 'productionPlant.city',
    valueFormatter: ColumnUtilityService.basicTransform,
  },
  {
    headerName: translate('shared.quotationDetailsTable.productionCountry'),
    field: 'productionPlant.country',
    valueFormatter: ColumnUtilityService.basicTransform,
  },
  {
    headerName: translate('shared.quotationDetailsTable.productLine'),
    field: 'material.productLineId',
    valueFormatter: ColumnUtilityService.basicTransform,
  },
  {
    headerName: translate('shared.quotationDetailsTable.gpsd'),
    field: 'material.gpsdGroupId',
    valueFormatter: ColumnUtilityService.basicTransform,
  },
];
