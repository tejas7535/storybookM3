import { ColDef } from 'ag-grid-community';

import {
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  STATUS,
} from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { StatusCellRendererComponent } from '@mac/msd/main-table/status-cell-renderer/status-cell-renderer.component';
import {
  CUSTOM_DATE_FORMATTER,
  FILTER_PARAMS,
  STATUS_VALUE_GETTER,
} from '@mac/msd/main-table/table-config';

import { HISTORY_COLUMN_DEFINITION } from './global-column-definitions';

export const BASE_SUPPLIERS_COLUMN_DEFINITIONS: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
  {
    field: MANUFACTURER_SUPPLIER_NAME,
    headerName: 'Supplier Name',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_PLANT,
    headerName: 'Supplier Plant',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_COUNTRY,
    headerName: 'Supplier Country',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: STATUS,
    headerName: 'Status',
    filterParams: FILTER_PARAMS,
    cellRenderer: StatusCellRendererComponent,
    valueGetter: STATUS_VALUE_GETTER,
  },
  {
    field: LAST_MODIFIED,
    headerName: 'Last Modified',
    filter: 'agDateColumnFilter',
    valueFormatter: CUSTOM_DATE_FORMATTER,
    sort: 'desc',
  },
];
