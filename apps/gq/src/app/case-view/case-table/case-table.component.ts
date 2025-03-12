import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  ColDef,
  ColumnEvent,
  ColumnState,
  FilterChangedEvent,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GridReadyEvent,
  MenuItemDef,
  RowDoubleClickedEvent,
  RowSelectedEvent,
  SelectionColumnDef,
  SortChangedEvent,
} from 'ag-grid-enterprise';

import { COMPONENTS, DEFAULT_COLUMN_DEFS, ROW_SELECTION } from './config';
import { ColumnDefService } from './config/column-def.service';
import {
  CASE_TABLE_CUSTOM_VIEWS_CONFIG,
  customViewIdByQuotationTab,
} from './config/custom-views.config';
@Component({
  selector: 'gq-case-table',
  templateUrl: './case-table.component.html',
  styles: [basicTableStyle, disableTableHorizontalScrollbar, statusBarStlye],
  standalone: false,
})
export class CaseTableComponent implements OnInit, OnDestroy {
  @Input() rowData: ViewQuotation[];
  @Input() statusBar: AgStatusBar;
  @Input() activeTab: QuotationTab;

  defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  rowSelection = ROW_SELECTION;
  columnDefs: ColDef[];
  components = COMPONENTS;
  selectionColumnDef: SelectionColumnDef = {
    pinned: 'left',
  };
  localeText$: Observable<AgGridLocale>;
  selectedRows: number[] = [];

  private readonly TABLE_KEY = 'CASE_OVERVIEW';

  constructor(
    private readonly columnDefService: ColumnDefService,
    private readonly columnUtilityService: ColumnUtilityService,
    private readonly localizationService: LocalizationService,
    private readonly router: Router,
    private readonly overviewCasesFacade: OverviewCasesFacade,
    private readonly agGridStateService: AgGridStateService
  ) {}

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
    this.agGridStateService.init(
      this.TABLE_KEY,
      CASE_TABLE_CUSTOM_VIEWS_CONFIG
    );
    this.agGridStateService.setActiveView(this.getActiveView());

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
        ) &&
        this.columnUtilityService.filterSharedQuotationsColumns(
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

  ngOnDestroy(): void {
    this.agGridStateService.saveUserSettings();
  }

  public onColumnChange(event: SortChangedEvent | ColumnEvent): void {
    const columnState: ColumnState[] = event.api.getColumnState();

    this.agGridStateService.setColumnStateForCurrentView(columnState);
  }

  public onFilterChanged(event: FilterChangedEvent): void {
    const filterModels = event.api.getFilterModel();
    this.agGridStateService.setColumnFilterForCurrentView(
      this.activeTab, // quotationId is a string, so we use the table name to find the filter
      filterModels
    );
  }

  onGridReady(event: GridReadyEvent): void {
    event.api.forEachNode((node) => {
      if (this.selectedRows.includes(node.data.gqId)) {
        node.setSelected(true);
      }
    });

    const state = this.agGridStateService.getColumnStateForCurrentView();
    if (state) {
      event.api.applyColumnState({ state, applyOrder: true });
    }

    // apply filters
    const filterState =
      this.agGridStateService.getColumnFiltersForCurrentView();
    const curFilter = filterState.find(
      (filterVal) => filterVal.actionItemId === this.activeTab
    );
    event?.api?.setFilterModel?.(curFilter?.filterModels || {});
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
      this.columnUtilityService.determineCaseNavigationPath(
        event.data.status,
        event.data.enabledForApprovalWorkflow
      ),
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
      this.columnUtilityService.getCopyCellContentContextMenuItem(params),
      ...hyperlinkMenuItems,
    ];
  }

  /**
   * depending on the tab clicked
   */
  private getActiveView(): number {
    return this.activeTab === QuotationTab.ACTIVE
      ? 0
      : customViewIdByQuotationTab.get(this.activeTab);
  }
}
