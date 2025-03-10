import { GqIdComponent } from '@gq/shared/ag-grid/cell-renderer/gq-id/gq-id.component';
import { ColDef } from 'ag-grid-enterprise';

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
