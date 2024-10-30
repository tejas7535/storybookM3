import { ColumnApi, GridApi } from 'ag-grid-community';

import { GlobalSelectionCriteriaFilters } from '../../../../../feature/global-selection/model';

export interface ExportTableDialogData {
  columnApi: ColumnApi;
  gridApi: GridApi;
  filter: GlobalSelectionCriteriaFilters;
}
