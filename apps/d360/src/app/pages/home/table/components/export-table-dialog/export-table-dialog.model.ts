import { GridApi } from 'ag-grid-enterprise';

import { GlobalSelectionCriteriaFilters } from '../../../../../feature/global-selection/model';

export interface ExportTableDialogData {
  gridApi: GridApi;
  filter: GlobalSelectionCriteriaFilters;
}
