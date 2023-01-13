import { ColDef } from 'ag-grid-community';

import { ACTION, HISTORY } from '@mac/msd/constants';
import { ActionCellRendererComponent } from '@mac/msd/main-table/action-cell-renderer/action-cell-renderer.component';

export const EDITOR_COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: ACTION,
    headerName: 'action',
    filter: false,
    cellRenderer: ActionCellRendererComponent,
    width: 95, // 140 for 3 icons
    pinned: 'right',
    lockPinned: true,
    lockPosition: true,
    resizable: false,
    suppressMenu: true,
    suppressMovable: true,
    sortable: false,
    lockVisible: true,
    cellClass: 'px-0',
  },
];

export const HISTORY_COLUMN_DEFINITION: ColDef = {
  field: HISTORY,
  headerName: 'history',
  cellRenderer: 'agGroupCellRenderer',
  cellClass: '!px-4',
  width: 48,
  pinned: 'left',
  lockVisible: true,
  lockPinned: true,
  lockPosition: true,
  sortable: false,
  filter: false,
  resizable: false,
  suppressMenu: true,
  suppressMovable: true,
  headerValueGetter: () => '',
  valueGetter: () => '',
};
