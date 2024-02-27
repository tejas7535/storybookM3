import { Injectable } from '@angular/core';

import { ComparableMaterialsRowData } from '@gq/core/store/reducers/transactions/models/f-pricing-comparable-materials.interface';
import { ReferenceMaterialGroupCellComponent } from '@gq/shared/ag-grid/cell-renderer/reference-material-group-cell/reference-material-group-cell.component';
import { ShowMoreRowsComponent } from '@gq/shared/ag-grid/cell-renderer/show-more-rows/show-more-rows.component';
import { ReferencePricingColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { FILTER_PARAMS } from '@gq/shared/ag-grid/constants/filters';
import { translate } from '@ngneat/transloco';
import {
  ColDef,
  GetRowIdParams,
  GridOptions,
  IsFullWidthRowParams,
} from 'ag-grid-community';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  INITIAL_NUMBER_OF_DISPLAYED_ROWS = 5;
  ROWS_TO_ADD_ON_SHOW_MORE = 10;

  DEFAULT_COL_DEF: ColDef = {
    suppressMovable: true,
    sortable: false,
  };

  ROW_GROUP_CONFIG: ColDef = {
    headerName: translate(
      'fPricing.pricingAssistantModal.referencePricingTable.item'
    ),
    field: ReferencePricingColumnFields.CUSTOMER_NAME,
    cellRendererParams: {
      suppressCount: true,
    },
    minWidth: 250,
  };

  GRID_OPTIONS: GridOptions = {
    isFullWidthRow: (params: IsFullWidthRowParams) =>
      params.rowNode?.data?.isShowMoreRow,
    fullWidthCellRenderer: ShowMoreRowsComponent,
    fullWidthCellRendererParams: {
      amountToAdd: this.ROWS_TO_ADD_ON_SHOW_MORE,
    },
    getRowId: (params: GetRowIdParams<ComparableMaterialsRowData>) =>
      // value MUST be unique
      params.data?.identifier.toString(),
  };

  COLUMN_DEFS: ColDef[] = [
    {
      field: ReferencePricingColumnFields.PARENT_MATERIAL_DESCRIPTION,
      cellRendererSelector: (params: any) => {
        if (!params.data) {
          return { component: ReferenceMaterialGroupCellComponent };
        }

        // eslint-disable-next-line unicorn/no-null
        return null;
      },
      rowGroup: true,
      hide: true,
      suppressColumnsToolPanel: true,
    },
    {
      field: ReferencePricingColumnFields.IS_SHOW_MORE_ROW,
      hide: true,
      suppressColumnsToolPanel: true,
      sort: 'asc',
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.materialDescription'
      ),
      field: ReferencePricingColumnFields.MATERIAL_DESCRIPTION,
      filterParams: FILTER_PARAMS,
      resizable: true,
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.materialNumber'
      ),
      field: ReferencePricingColumnFields.MATERIAL_NUMBER,
      filterParams: FILTER_PARAMS,
      resizable: true,
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.quantity'
      ),
      field: ReferencePricingColumnFields.QUANTITY,
      filterParams: FILTER_PARAMS,
      resizable: true,
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.price'
      ),
      field: ReferencePricingColumnFields.PRICE,
      filterParams: FILTER_PARAMS,
      resizable: true,
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.year'
      ),
      field: ReferencePricingColumnFields.YEAR,
      filterParams: FILTER_PARAMS,
      resizable: true,
    },
  ];
}
