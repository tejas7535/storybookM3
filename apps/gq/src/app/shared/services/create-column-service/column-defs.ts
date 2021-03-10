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
    field: 'orderQuantity',
    valueFormatter: ColumnUtilityService.numberFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.offerPrice'),
    field: 'price',
    valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.per'),
    valueFormatter: () => '1',
    field: 'per',
  },
  {
    headerName: translate('shared.quotationDetailsTable.uom'),
    field: 'material.baseUoM',
  },
  {
    headerName: translate('shared.quotationDetailsTable.netValue'),
    field: 'netValue',
    valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
  },
  {
    headerName: translate('shared.quotationDetailsTable.priceSource'),
    // currently missing in the database ?
    field: 'priceSource',
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
    field: 'lastCustomerPrice',
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
  },
  {
    headerName: translate('shared.quotationDetailsTable.productionPlant'),
    field: 'productionPlant.plantNumber',
  },
  {
    headerName: translate('shared.quotationDetailsTable.productionCity'),
    // currently missing in the database -> BE: adjust PlantDto
    field: 'productionCity',
  },
  {
    headerName: translate('shared.quotationDetailsTable.productionCountry'),
    // currently missing in the database -> BE: adjust PlantDto
    field: 'productionCountry',
  },
  {
    headerName: translate('shared.quotationDetailsTable.productLine'),
    field: 'material.productLineId',
  },
  {
    headerName: translate('shared.quotationDetailsTable.gpsd'),
    field: 'material.gpsdGroupId',
  },
];
