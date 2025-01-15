import { ColDef } from 'ag-grid-community';

import {
  LAST_MODIFIED,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
  RECENT_STATUS,
} from '@mac/msd/constants';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import { CUSTOM_DATE_FORMATTER } from '@mac/msd/main-table/table-config/helpers';

import { EditCellRendererComponent } from '../../../cell-renderers/edit-cell-renderer/edit-cell-renderer.component';
import { RecentStatusCellRendererComponent } from '../../../cell-renderers/recent-status-cell-renderer/recent-status-cell-renderer.component';
import { HISTORY_COLUMN_DEFINITION } from './global-column-definitions';

export const BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
  {
    field: MATERIAL_STANDARD_MATERIAL_NAME,
    headerName: MATERIAL_STANDARD_MATERIAL_NAME,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MATERIAL_STANDARD_STANDARD_DOCUMENT,
    headerName: MATERIAL_STANDARD_STANDARD_DOCUMENT,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RECENT_STATUS,
    headerName: RECENT_STATUS,
    filterParams: FILTER_PARAMS,
    cellRenderer: RecentStatusCellRendererComponent,
    valueGetter: () => 1,
    headerValueGetter: () => '',
    cellClass: ['!pl-0', '!pr-2'],
    width: 60,
    pinned: 'left',
    lockPinned: true,
    lockVisible: true,
    lockPosition: true,
    resizable: true,
    suppressMovable: true,
    hide: false,
    suppressHeaderMenuButton: true,
    sortable: false,
    filter: false,
  },
  {
    field: LAST_MODIFIED,
    headerName: LAST_MODIFIED,
    filter: 'agDateColumnFilter',
    valueFormatter: CUSTOM_DATE_FORMATTER,
    sort: 'desc',
  },
];
