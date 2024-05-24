import { GqIdComponent } from '@gq/shared/ag-grid/cell-renderer/gq-id/gq-id.component';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import {
  ColDef,
  GetContextMenuItemsParams,
  GridOptions,
  MenuItemDef,
} from 'ag-grid-enterprise';

import { MaterialsCriteriaSelection } from '../materials-result-table/material-criteria-selection.enum';

/**
 * This default config file contains values that will be utilized in both the search by cases and search by materials tables.
 * Any updates or modifications can be made at a single location within the code.
 */
export const COMPONENTS = {
  gqIdComponent: GqIdComponent,
};

export const DEFAULT_COL_DEF: ColDef = {
  enablePivot: false,
  resizable: true,
  filter: true,
  floatingFilter: true,
  sortable: true,
};

export const DEFAULT_GRID_OPTIONS: GridOptions = {
  suppressDragLeaveHidesColumns: true,

  getContextMenuItems: (params: GetContextMenuItemsParams) => {
    // TODO: as long as the cell do NOT have a cellRenderer with url applied
    // the contextMenu will result in any action, the contextMenu items are just displayed
    // provide openInOtherTab/Window with the following Story {@link https://jira.schaeffler.com/browse/GQUOTE-3805}
    let hyperlinkMenuItems: (string | MenuItemDef)[] = [];
    hyperlinkMenuItems = [
      ColumnUtilityService.getOpenInNewTabContextMenuItem(params),
      ColumnUtilityService.getOpenInNewWindowContextMenuItem(params),
    ];

    return [
      ColumnUtilityService.getCopyCellContentContextMenuItem(params),
      ...hyperlinkMenuItems,
    ];
  },
};
export const GRID_OPTIONS: GridOptions = {
  ...DEFAULT_GRID_OPTIONS,
  // pagination true/false will be set via Input by the component
  pagination: true,
  paginationPageSize: 8,
};

export const GRID_OPTIONS_WITHOUT_PAGINATION: GridOptions = {
  ...DEFAULT_GRID_OPTIONS,
  pagination: false,
};

export interface ValidationConfig {
  minLength?: number;
}

/**
 * Configuration of validation rules bound to the specific search criteria
 */
export const SEARCH_CRITERIA_VALIDATION_CONFIG: {
  [key: string]: ValidationConfig;
} = {
  [MaterialsCriteriaSelection.MATERIAL_NUMBER]: { minLength: 9 },
  default: { minLength: 3 },
};
