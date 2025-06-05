import { RowSelectionOptions } from 'ag-grid-enterprise';

export const ROW_SELECTION: RowSelectionOptions = {
  mode: 'multiRow',
  headerCheckbox: false,
  selectAll: 'filtered',
  checkboxes: false,
  enableSelectionWithoutKeys: true,
  enableClickSelection: true,
  copySelectedRows: true,
};
