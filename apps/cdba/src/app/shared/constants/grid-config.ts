import {
  GridOptions,
  RowSelectionOptions,
  SelectionColumnDef,
} from 'ag-grid-enterprise';

export const DEFAULT_SELECTION_COLUMN_DEF: SelectionColumnDef = {
  sortable: false,
  resizable: false,
  suppressHeaderMenuButton: true,
  flex: 1,
  width: 0,
  maxWidth: 50,
  pinned: 'left',
  lockPinned: true,
};

export const DEFAULT_ROW_SELECTION: RowSelectionOptions = {
  mode: 'multiRow',
  selectAll: 'currentPage',
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: true,
  enableSelectionWithoutKeys: true,
};

export const DEFAULT_GRID_OPTIONS: GridOptions = {
  tooltipShowDelay: 250,
};
