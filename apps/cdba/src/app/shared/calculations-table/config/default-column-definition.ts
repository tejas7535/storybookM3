import { ColDef } from '@ag-grid-community/all-modules';

export const DEFAULT_COLUMN_DEFINITION: ColDef = {
  sortable: true,
  resizable: true,
  enablePivot: false,
  enableRowGroup: true,
  filterParams: {
    buttons: ['reset'],
  },
  filter: 'agTextColumnFilter',
  cellClass: 'line-height-30',
};
