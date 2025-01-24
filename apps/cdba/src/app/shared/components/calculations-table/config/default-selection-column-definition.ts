import { SelectionColumnDef } from 'ag-grid-enterprise';

export const DEFAULT_SELECTION_COLUMN_DEFINITION: SelectionColumnDef = {
  sortable: false,
  resizable: false,
  suppressHeaderMenuButton: true,
  suppressHeaderContextMenu: true,
  pinned: 'left',
  lockPinned: true,
  width: 600,
  cellClass: 'flex h-full items-center',
};
