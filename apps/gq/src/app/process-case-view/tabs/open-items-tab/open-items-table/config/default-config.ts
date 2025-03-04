import { PositionIdComponent } from '@gq/shared/ag-grid/cell-renderer/position-id/position-id.component';
import { ColDef } from 'ag-grid-community';

export const COMPONENTS = {
  PositionIdComponent,
};

export const DEFAULT_COL_DEF: ColDef = {
  enablePivot: false,
  resizable: true,
  filter: true,
  floatingFilter: true,
  sortable: true,
  minWidth: 100,
};
