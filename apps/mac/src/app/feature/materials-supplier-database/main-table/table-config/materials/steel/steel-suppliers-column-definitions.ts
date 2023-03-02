import { ColDef } from 'ag-grid-community';

import {
  MANUFACTURER,
  SAP_SUPPLIER_IDS,
} from '@mac/feature/materials-supplier-database/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import { MANUFACTURER_VALUE_GETTER } from '@mac/msd/main-table/table-config/helpers';
import { BASE_SUPPLIERS_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

export const STEEL_SUPPLIERS_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_SUPPLIERS_COLUMN_DEFINITIONS,
  {
    field: MANUFACTURER,
    headerName: MANUFACTURER,
    hide: true,
    cellRenderer: EditCellRendererComponent,
    valueGetter: MANUFACTURER_VALUE_GETTER,
  },
  {
    field: SAP_SUPPLIER_IDS,
    headerName: SAP_SUPPLIER_IDS,
    filterParams: FILTER_PARAMS,
    hide: true,
  },
];
