import { inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { SearchByCasesOrMaterialsColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { QuotationSearchResultByMaterials } from '@gq/shared/models/quotation/quotation-search-result-by-materials.interface';
import { addMaterialFilterToQueryParams } from '@gq/shared/utils/misc.utils';
import {
  GetContextMenuItemsParams,
  GridOptions,
  MenuItemDef,
} from 'ag-grid-enterprise';

import { SearchbarGridContext } from './searchbar-grid-context.interface';

@Injectable({
  providedIn: 'root',
})
export class GridOptionsService {
  private readonly columnUtilityService = inject(ColumnUtilityService);

  DEFAULT_GRID_OPTIONS: GridOptions = {
    suppressDragLeaveHidesColumns: true,

    getContextMenuItems: (params: GetContextMenuItemsParams) => {
      // gqId column is the only column with a cellRenderer that has a url applied
      let hyperlinkMenuItems: (string | MenuItemDef)[] = [];
      if (
        params.column.getColId() ===
          SearchByCasesOrMaterialsColumnFields.GQ_ID &&
        params.value
      ) {
        hyperlinkMenuItems = [
          ColumnUtilityService.getOpenInNewTabContextMenuItem(params),
          ColumnUtilityService.getOpenInNewWindowContextMenuItem(params),
        ];
      } else if (params.node?.data) {
        // openInTab/WindowByURL
        const url = this.getUrlByColumnData(params);
        hyperlinkMenuItems = [
          ColumnUtilityService.getOpenInNewTabContextMenuItemByUrl(url),
          ColumnUtilityService.getOpenInNewWindowContextMenuItemByUrl(url),
        ];
      }

      return [
        this.columnUtilityService.getCopyCellContentContextMenuItem(params),
        ...hyperlinkMenuItems,
      ];
    },
  };

  GRID_OPTIONS: GridOptions = {
    ...this.DEFAULT_GRID_OPTIONS,
    // pagination true/false will be set via Input by the component
    pagination: true,
    paginationAutoPageSize: true,
  };

  GRID_OPTIONS_WITHOUT_PAGINATION: GridOptions = {
    ...this.DEFAULT_GRID_OPTIONS,
    pagination: false,
  };

  getUrlByColumnData(params: GetContextMenuItemsParams): string {
    const gqCase = params.node.data;
    const context = params.context as SearchbarGridContext;
    const queryParams: Params = {
      quotation_number: gqCase.gqId,
      customer_number: gqCase.customerId,
      sales_org: gqCase.salesOrg,
    };

    addMaterialFilterToQueryParams(
      queryParams,
      context,
      params.node.data as QuotationSearchResultByMaterials
    );

    const url = context.router.createUrlTree(
      context.columnUtilityService.determineCaseNavigationPath(
        gqCase.status,
        gqCase.enabledForApprovalWorkflow
      ),
      {
        queryParamsHandling: 'merge',
        queryParams,
      }
    );

    return url.toString();
  }
}
