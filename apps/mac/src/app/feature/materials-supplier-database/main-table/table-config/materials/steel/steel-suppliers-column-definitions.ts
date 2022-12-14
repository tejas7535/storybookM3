import { ColDef } from 'ag-grid-community';

import {
  MANUFACTURER,
  SAP_SUPPLIER_IDS,
} from '@mac/feature/materials-supplier-database/constants';
import {
  FILTER_PARAMS,
  MANUFACTURER_VALUE_GETTER,
} from '@mac/msd/main-table/table-config';
import { BASE_SUPPLIERS_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';

export const STEEL_SUPPLIERS_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_SUPPLIERS_COLUMN_DEFINITIONS,
  {
    field: MANUFACTURER,
    headerName: 'Iron- & Steelmaking',
    hide: true,
    cellRenderer: EditCellRendererComponent,
    valueGetter: MANUFACTURER_VALUE_GETTER,
  },
  {
    field: SAP_SUPPLIER_IDS,
    headerName: 'SAP Supplier ID(s)',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
];
