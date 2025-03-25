import { PositionIdComponent } from '@gq/shared/ag-grid/cell-renderer/position-id/position-id.component';
import { ColDef, GridOptions } from 'ag-grid-enterprise';

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

export const GRID_OPTIONS: GridOptions = {
  suppressMovableColumns: true,
};
