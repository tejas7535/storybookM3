import { inject } from '@angular/core';

import { PositionIdComponent } from '@gq/shared/ag-grid/cell-renderer/position-id/position-id.component';
import { SqvApprovalStatusCellComponent } from '@gq/shared/ag-grid/cell-renderer/sqv-approval-status-cell/sqv-approval-status-cell.component';
import { SqvCheckStatusCellComponent } from '@gq/shared/ag-grid/cell-renderer/sqv-check-status-cell/sqv-check-status-cell.component';
import { FILTER_PARAMS } from '@gq/shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { RecalculationReasons } from '@gq/shared/models/quotation-detail/cost/recalculation-reasons.enum';
import { translate } from '@jsverse/transloco';
import {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-enterprise';

import { OpenItemsColumnFields } from './column-fields.enum';
import { COMPONENTS, DEFAULT_COL_DEF, GRID_OPTIONS } from './default-config';

export class ColumnDefinitionService {
  private readonly columnUtilityService: ColumnUtilityService =
    inject(ColumnUtilityService);

  COMPONENTS = COMPONENTS;
  DEFAULT_COL_DEF = DEFAULT_COL_DEF;
  GRID_OPTIONS = GRID_OPTIONS;

  COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('shared.openItemsTable.item'),
      field: OpenItemsColumnFields.QUOTATION_ITEM_ID,
      cellRenderer: PositionIdComponent,
      sort: 'asc',
      pinned: 'left',
      filterParams: {
        ...FILTER_PARAMS,
        comparator: (a: string, b: string) =>
          Number.parseInt(a, 10) - Number.parseInt(b, 10),
      },
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: translate('shared.openItemsTable.materialDescription'),
      field: OpenItemsColumnFields.MATERIAL_DESCRIPTION,
      filterParams: FILTER_PARAMS,
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: translate('shared.openItemsTable.materialNumber'),
      field: OpenItemsColumnFields.MATERIAL_NUMBER_15,
      valueFormatter: (params) =>
        this.columnUtilityService.materialTransform(params),
      valueGetter: (params) => this.columnUtilityService.materialGetter(params),
      filterParams: FILTER_PARAMS,
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: translate('shared.openItemsTable.status'),
      field: OpenItemsColumnFields.STATUS,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          translate('shared.sqvCheckStatusLabels.sqvCheckStatus', {
            sqvCheckStatus: params.value,
          }),
      },
      valueFormatter: (params: ValueFormatterParams) =>
        translate('shared.sqvCheckStatusLabels.sqvCheckStatus', {
          sqvCheckStatus: params.value,
        }),
      cellRenderer: SqvCheckStatusCellComponent,
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: translate('shared.openItemsTable.issueToResolve.header'),
      field: OpenItemsColumnFields.ISSUE_TO_RESOLVE,
      valueGetter: (params) => this.getSqvStatusText(params),
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: translate('shared.openItemsTable.approval'),
      field: OpenItemsColumnFields.APPROVAL,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          translate(
            'shared.sqvApprovalStatusLabels.sqvApprovalStatusForFilter',
            {
              sqvApprovalStatus: params.value,
            }
          ),
      },
      valueFormatter: (params: ValueFormatterParams) =>
        translate('shared.sqvApprovalStatusLabels.sqvApprovalStatus', {
          sqvApprovalStatus: params.value,
        }),
      cellRenderer: SqvApprovalStatusCellComponent,
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
  ];

  // utilities
  getSqvStatusText(params: ValueGetterParams): string {
    switch (params.data.detailCosts?.sqvRecalculationReason) {
      case RecalculationReasons.NOT_AVAILABLE: {
        return translate(
          `shared.openItemsTable.issueToResolve.${RecalculationReasons.NOT_AVAILABLE.toLocaleLowerCase()}`
        );
      }

      case RecalculationReasons.INVALID: {
        return translate(
          `shared.openItemsTable.issueToResolve.${RecalculationReasons.INVALID.toLocaleLowerCase()}`,
          {
            months: params.data.detailCosts?.sqvRecalculationValue,
          }
        );
      }
      // no default
    }

    return '';
  }
}
