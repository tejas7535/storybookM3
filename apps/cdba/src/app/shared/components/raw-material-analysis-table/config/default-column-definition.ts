import { ColDef } from 'ag-grid-enterprise';

export const DEFAULT_COLUMN_DEFINITION: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  enablePivot: false,
  enableRowGroup: false,
  filterParams: {
    buttons: ['reset'],
  },
  menuTabs: ['filterMenuTab', 'generalMenuTab'],
  cellClass: 'line-height-30',
};
