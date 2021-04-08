import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { ColumnUtilityService } from '../../services/column-utility-service/column-utility.service';

export const COLUMN_DEFS_SHORT: ColDef[] = [
  {
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    pinned: 'left',
    filter: false,
    resizable: false,
    suppressMenu: true,
    width: 30,
  },
  {
    headerName: translate('shared.offerTable.materialDescription'),
    field: 'material.materialDescription',
  },
  {
    headerName: translate('shared.offerTable.price'),
    field: 'price',
    valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
  },
  {
    headerName: translate('shared.offerTable.netValue'),
    field: 'netValue',
    valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
  },
  {
    headerName: translate('shared.offerTable.quantity'),
    field: 'orderQuantity',
    valueFormatter: ColumnUtilityService.numberFormatter,
  },
];
