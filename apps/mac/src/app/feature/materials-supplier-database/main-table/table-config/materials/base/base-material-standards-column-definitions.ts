import { ColDef } from 'ag-grid-community';

import {
  LAST_MODIFIED,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
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

export const BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
  {
    field: MATERIAL_STANDARD_MATERIAL_NAME,
    headerName: 'Material Name',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MATERIAL_STANDARD_STANDARD_DOCUMENT,
    headerName: 'Standard Document',
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
