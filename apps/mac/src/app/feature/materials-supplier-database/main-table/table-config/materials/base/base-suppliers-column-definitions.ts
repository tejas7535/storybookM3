import { ColDef } from 'ag-grid-community';

import {
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  RECENT_STATUS,
  SAP_SUPPLIER_IDS,
} from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import { CUSTOM_DATE_FORMATTER } from '@mac/msd/main-table/table-config/helpers';

import { RecentStatusCellRendererComponent } from '../../../recent-status-cell-renderer/recent-status-cell-renderer.component';
import { HISTORY_COLUMN_DEFINITION } from './global-column-definitions';

export const BASE_SUPPLIERS_COLUMN_DEFINITIONS: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
  {
    field: MANUFACTURER_SUPPLIER_NAME,
    headerName: MANUFACTURER_SUPPLIER_NAME,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_PLANT,
    headerName: MANUFACTURER_SUPPLIER_PLANT,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_COUNTRY,
    headerName: MANUFACTURER_SUPPLIER_COUNTRY,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: SAP_SUPPLIER_IDS,
    headerName: SAP_SUPPLIER_IDS,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
    hide: true,
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
    suppressMenu: true,
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
