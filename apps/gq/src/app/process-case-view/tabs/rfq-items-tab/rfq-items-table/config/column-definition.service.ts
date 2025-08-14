import { inject } from '@angular/core';

import { MenuActionCellComponent } from '@gq/shared/ag-grid/cell-renderer/action-cells/menu-action-cell/menu-action-cell.component';
import { MenuItemCellRendererParams } from '@gq/shared/ag-grid/cell-renderer/action-cells/menu-action-cell/model/menu-item-cell-renderer-params.interface';
import { PositionIdComponent } from '@gq/shared/ag-grid/cell-renderer/position-id/position-id.component';
import { Rfq4StatusCellComponent } from '@gq/shared/ag-grid/cell-renderer/rfq-4-status-cell/rfq-4-status-cell.component';
import { SqvApprovalStatusCellComponent } from '@gq/shared/ag-grid/cell-renderer/sqv-approval-status-cell/sqv-approval-status-cell.component';
import { FILTER_PARAMS } from '@gq/shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { RecalculationReasons } from '@gq/shared/models/quotation-detail/cost/recalculation-reasons.enum';
import { translate } from '@jsverse/transloco';
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-enterprise';

import { ModalConfigurationService } from '../modals/modal-configuration.service';
import { RfqItemsColumnFields } from './column-fields.enum';
import { COMPONENTS, DEFAULT_COL_DEF, GRID_OPTIONS } from './default-config';

export class ColumnDefinitionService {
  private readonly columnUtilityService: ColumnUtilityService =
    inject(ColumnUtilityService);
  private readonly modalService: ModalConfigurationService = inject(
    ModalConfigurationService
  );

  COMPONENTS = COMPONENTS;
  DEFAULT_COL_DEF = DEFAULT_COL_DEF;
  GRID_OPTIONS = GRID_OPTIONS;

  COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('shared.rfqItemsTable.item'),
      field: RfqItemsColumnFields.QUOTATION_ITEM_ID,
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
      headerName: translate('shared.rfqItemsTable.materialDescription'),
      field: RfqItemsColumnFields.MATERIAL_DESCRIPTION,
      filterParams: FILTER_PARAMS,
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: translate('shared.rfqItemsTable.materialNumber'),
      field: RfqItemsColumnFields.MATERIAL_NUMBER_15,
      valueFormatter: (params) =>
        this.columnUtilityService.materialTransform(params),
      valueGetter: (params) => this.columnUtilityService.materialGetter(params),
      filterParams: FILTER_PARAMS,
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: translate('shared.rfqItemsTable.status'),
      field: RfqItemsColumnFields.STATUS,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          translate('shared.rfq4StatusLabels.rfq4Status', {
            rfq4Status: params.value,
          }),
      },
      valueFormatter: (params: ValueFormatterParams) =>
        translate('shared.rfq4StatusLabels.rfq4Status', {
          rfq4Status: params.value,
        }),
      cellRenderer: Rfq4StatusCellComponent,
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: translate('shared.rfqItemsTable.issueToResolve.header'),
      field: RfqItemsColumnFields.ISSUE_TO_RESOLVE,
      valueGetter: (params) => this.getSqvStatusText(params),
      flex: 0.25,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: translate('shared.rfqItemsTable.approval'),
      field: RfqItemsColumnFields.APPROVAL,
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
    {
      filter: false,
      floatingFilter: false,
      cellRenderer: MenuActionCellComponent,
      width: 50,
      maxWidth: 100,
      cellRendererParams: (params: ICellRendererParams) =>
        ({
          menuDisabled: false,
          menuItems: this.modalService.getMenuItemsByStatus(
            params.data.rfq4.rfq4Status,
            params.data
          ),
        }) as MenuItemCellRendererParams,
    },
  ];

  // utilities
  getSqvStatusText(params: ValueGetterParams): string {
    switch (params.data.sqvCheck?.sqvCheckStatus) {
      case RecalculationReasons.NOT_AVAILABLE: {
        return translate(
          `shared.rfqItemsTable.issueToResolve.${RecalculationReasons.NOT_AVAILABLE.toLocaleLowerCase()}`
        );
      }

      case RecalculationReasons.INVALID: {
        return translate(
          `shared.rfqItemsTable.issueToResolve.${RecalculationReasons.INVALID.toLocaleLowerCase()}`,
          {
            months: params.data.sqvCheck?.sqvRecalculationValue,
          }
        );
      }
      // no default
    }

    return '';
  }
}
