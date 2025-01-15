import { RowSelectionOptions } from 'ag-grid-enterprise';

export const ROW_SELECTION: RowSelectionOptions = {
  mode: 'multiRow',
  headerCheckbox: true,
  selectAll: 'filtered',
  checkboxes: true,
  enableSelectionWithoutKeys: true,
};
