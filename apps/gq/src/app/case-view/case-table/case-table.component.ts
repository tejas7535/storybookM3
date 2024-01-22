import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject, take, takeUntil } from 'rxjs';

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
import { FilterState } from '@gq/shared/models/grid-state.model';
import { ViewQuotation } from '@gq/shared/models/quotation';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  ColDef,
  ColumnState,
  FilterChangedEvent,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GridReadyEvent,
  MenuItemDef,
  RowDoubleClickedEvent,
  RowSelectedEvent,
  SortChangedEvent,
} from 'ag-grid-community';

import { COMPONENTS, DEFAULT_COLUMN_DEFS } from './config';
import { ColumnDefService } from './config/column-def.service';
import {
  CASE_TABLE_CUSTOM_VIEWS_CONFIG,
  customViewIdByQuotationTab,
} from './config/custom-views.config';
@Component({
  selector: 'gq-case-table',
  templateUrl: './case-table.component.html',
  styles: [basicTableStyle, disableTableHorizontalScrollbar, statusBarStlye],
})
export class CaseTableComponent implements OnInit, OnDestroy {
  @Input() rowData: ViewQuotation[];
  @Input() statusBar: AgStatusBar;
  @Input() activeTab: QuotationTab;

  defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  columnDefs: ColDef[];
  components = COMPONENTS;
  localeText$: Observable<AgGridLocale>;
  selectedRows: number[] = [];
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

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
    if (this.unsubscribe$) {
      this.unsubscribe$.next(true);
      this.unsubscribe$.unsubscribe();
    }
  }
  public onColumnChange(event: SortChangedEvent): void {
    const columnState: ColumnState[] = event.columnApi.getColumnState();

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
      event.columnApi.applyColumnState({ state, applyOrder: true });
    }

    // apply filters
    this.agGridStateService.filterState
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((filterState: FilterState[]) => {
        const curFilter = filterState.find(
          (filter) => filter.actionItemId === this.activeTab // quotationId is a string, so we use the table name to find the filter
        );
        event?.api?.setFilterModel?.(curFilter?.filterModels || {});
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
      ColumnUtilityService.getCopyCellContentContextMenuItem(params),
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
