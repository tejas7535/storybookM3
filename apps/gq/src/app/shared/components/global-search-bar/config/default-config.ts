import { Params } from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { GqIdComponent } from '@gq/shared/ag-grid/cell-renderer/gq-id/gq-id.component';
import { SearchByCasesOrMaterialsColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { QuotationSearchResultByMaterials } from '@gq/shared/models/quotation/quotation-search-result-by-materials.interface';
import { addMaterialFilterToQueryParams } from '@gq/shared/utils/misc.utils';
import {
  ColDef,
  GetContextMenuItemsParams,
  GridOptions,
  MenuItemDef,
} from 'ag-grid-enterprise';

import { MaterialsCriteriaSelection } from '../materials-result-table/material-criteria-selection.enum';
import { SearchbarGridContext } from './searchbar-grid-context.interface';

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
    // gqId column is the only column with a cellRenderer that has a url applied
    let hyperlinkMenuItems: (string | MenuItemDef)[] = [];
    if (
      params.column.getColId() === SearchByCasesOrMaterialsColumnFields.GQ_ID &&
      params.value
    ) {
      hyperlinkMenuItems = [
        ColumnUtilityService.getOpenInNewTabContextMenuItem(params),
        ColumnUtilityService.getOpenInNewWindowContextMenuItem(params),
      ];
    } else if (params.value) {
      // openInTab/WindowByURL
      const url = getUrlByColumnData(params);
      hyperlinkMenuItems = [
        ColumnUtilityService.getOpenInNewTabContextMenuItemByUrl(url),
        ColumnUtilityService.getOpenInNewWindowContextMenuItemByUrl(url),
      ];
    }

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

export function getUrlByColumnData(params: GetContextMenuItemsParams): string {
  const gqCase = params.node.data;
  const context = params.context as SearchbarGridContext;
  const queryParams: Params = {
    quotation_number: gqCase.gqId,
    customer_number: gqCase.customerIdentifiers.customerId,
    sales_org: gqCase.customerIdentifiers.salesOrg,
  };

  addMaterialFilterToQueryParams(
    queryParams,
    context,
    params.node.data as QuotationSearchResultByMaterials
  );

  const url = context.router.createUrlTree([AppRoutePath.ProcessCaseViewPath], {
    queryParamsHandling: 'merge',
    queryParams,
  });

  return url.toString();
}
