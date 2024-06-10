import { Router } from '@angular/router';

import { ColumnUtilityService } from '@gq/shared/ag-grid/services';

import { MaterialsCriteriaSelection } from '../materials-result-table/material-criteria-selection.enum';

export interface SearchbarGridContext {
  router: Router;
  columnUtilityService: ColumnUtilityService;
  filter?: MaterialsCriteriaSelection;
}
