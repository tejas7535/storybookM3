import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, take } from 'rxjs';

import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import { OverviewCasesFacade } from '@gq/core/store/overview-cases/overview-cases.facade';
import { CaseTableColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { AgStatusBar } from '@gq/shared/ag-grid/models/ag-status-bar.model';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { LocalizationService } from '@gq/shared/ag-grid/services/localization.service';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
  statusBarStlye,
} from '@gq/shared/constants';
import { ViewQuotation } from '@gq/shared/models/quotation';
import {
  ColDef,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GridReadyEvent,
  MenuItemDef,
  RowDoubleClickedEvent,
  RowSelectedEvent,
} from 'ag-grid-community';

import { COMPONENTS, DEFAULT_COLUMN_DEFS } from './config';
import { ColumnDefService } from './config/column-def.service';
@Component({
  selector: 'gq-case-table',
  templateUrl: './case-table.component.html',
  styles: [basicTableStyle, disableTableHorizontalScrollbar, statusBarStlye],
})
export class CaseTableComponent implements OnInit {
  @Input() rowData: ViewQuotation[];
  @Input() statusBar: AgStatusBar;
  @Input() activeTab: QuotationTab;

  defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  columnDefs: ColDef[];
  components = COMPONENTS;
  localeText$: Observable<AgGridLocale>;
  selectedRows: number[] = [];

  constructor(
    private readonly columnDefService: ColumnDefService,
    private readonly columnUtilityService: ColumnUtilityService,
    private readonly localizationService: LocalizationService,
    private readonly router: Router,
    private readonly overviewCasesFacade: OverviewCasesFacade
  ) {}

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
    this.overviewCasesFacade.selectedIds$
      .pipe(take(1))
      .subscribe((val) => (this.selectedRows = val));
    this.columnDefs = this.columnDefService.COLUMN_DEFS.filter(
      (colDef) =>
        this.columnUtilityService.filterSapSyncStatusColumns(
          colDef,
          this.activeTab
        ) &&
        this.columnUtilityService.filterQuotationStatusColumns(
          colDef,
          this.activeTab
        )
    ).map((colDef) =>
      this.columnUtilityService.mapLastUpdateDateOnColumn(
        colDef,
        this.activeTab
      )
    );
  }

  onGridReady(event: GridReadyEvent): void {
    event.api.forEachNode((node) => {
      if (this.selectedRows.includes(node.data.gqId)) {
        node.setSelected(true);
      }
    });
  }

  onRowSelected(event: RowSelectedEvent): void {
    if (event.node.isSelected()) {
      this.overviewCasesFacade.selectCase(event.node.data.gqId);
    } else {
      this.overviewCasesFacade.deselectCase(event.node.data.gqId);
    }
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(
      this.columnUtilityService.determineCaseNavigationPath(event.data.status),
      {
        queryParamsHandling: 'merge',
        queryParams: {
          quotation_number: event.data.gqId,
          customer_number: event.data.customerIdentifiers.customerId,
          sales_org: event.data.customerIdentifiers.salesOrg,
        },
      }
    );
  }

  getMainMenuItems(params: GetMainMenuItemsParams): (string | MenuItemDef)[] {
    const menuItems: (MenuItemDef | string)[] = [...params.defaultItems];
    menuItems.push(
      ColumnUtilityService.getResetAllFilteredColumnsMenuItem(params)
    );

    return menuItems;
  }

  getContextMenuItems(
    params: GetContextMenuItemsParams
  ): (string | MenuItemDef)[] {
    let hyperlinkMenuItems: (string | MenuItemDef)[] = [];
    const HYPERLINK_COLUMNS: string[] = [CaseTableColumnFields.GQ_ID];

    if (HYPERLINK_COLUMNS.includes(params.column.getColId())) {
      hyperlinkMenuItems = [
        ColumnUtilityService.getOpenInNewTabContextMenuItem(params),
        ColumnUtilityService.getOpenInNewWindowContextMenuItem(params),
      ];
    }

    return [
      ColumnUtilityService.getCopyCellContentContextMenuItem(params),
      ...hyperlinkMenuItems,
    ];
  }
}
