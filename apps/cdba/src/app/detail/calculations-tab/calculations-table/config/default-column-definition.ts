import { ColDef } from '@ag-grid-community/core';

export const DEFAULT_COLUMN_DEFINITION: ColDef = {
  sortable: true,
  resizable: true,
  enablePivot: false,
  enableRowGroup: true,
  filterParams: {
    resetButton: true,
  },
  filter: 'agTextColumnFilter',
};
