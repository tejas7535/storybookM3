import { ColDef } from '@ag-grid-enterprise/all-modules';

export const DEFAULT_COLUMN_DEFINITION: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  enablePivot: false,
  enableRowGroup: true,
  filterParams: {
    resetButton: true,
  },
  menuTabs: ['filterMenuTab', 'generalMenuTab'],
};
