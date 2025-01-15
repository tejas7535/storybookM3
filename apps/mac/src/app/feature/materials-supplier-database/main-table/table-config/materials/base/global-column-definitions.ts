import { ColDef } from 'ag-grid-community';

import { ACTION, HISTORY } from '@mac/msd/constants';

import { ActionCellRendererComponent } from '../../../cell-renderers/action-cell-renderer/action-cell-renderer.component';
import { ActionHeaderComponent } from '../../../components/action-header/action-header.component';

export const EDITOR_COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: ACTION,
    headerName: ACTION,
    filter: false,
    cellRenderer: ActionCellRendererComponent,
    width: 140, // 140 for 3 icons
    pinned: 'right',
    lockPinned: true,
    lockPosition: true,
    resizable: false,
    suppressHeaderMenuButton: true,
    suppressMovable: true,
    sortable: false,
    lockVisible: true,
    cellClass: 'px-2',
    checkboxSelection: false,
    headerClass: 'text-caption leading-6 font-medium px-2',
    headerComponent: ActionHeaderComponent,
  },
];

export const HISTORY_COLUMN_DEFINITION: ColDef = {
  field: HISTORY,
  headerName: HISTORY,
  cellRenderer: 'agGroupCellRenderer',
  cellClass: '!px-4',
  headerClass: ['!w-0', '!p-0'],
  width: 48,
  pinned: 'left',
  lockVisible: true,
  lockPinned: true,
  lockPosition: true,
  sortable: false,
  filter: false,
  resizable: false,
  suppressHeaderMenuButton: true,
  suppressMovable: true,
  headerValueGetter: () => '',
  valueGetter: () => '',
};
