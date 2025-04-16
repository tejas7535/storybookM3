/* eslint-disable max-lines */
import {
  AfterViewChecked,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, filter, map, Observable, skip, tap } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { excelStyles } from '@gq/shared/ag-grid/custom-status-bar/export-to-excel-button/excel-styles.constants';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import {
  ColumnDefService,
  ColumnUtilityService,
} from '@gq/shared/ag-grid/services';
import { LocalizationService } from '@gq/shared/ag-grid/services/localization.service';
import {
  basicTableStyle,
  statusBarSimulation,
  statusBarWithBorderStyle,
} from '@gq/shared/constants';
import { Quotation } from '@gq/shared/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { GridMergeService } from '@gq/shared/services/ag-grid-state/grid-merge.service';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import {
  ColDef,
  ColumnEvent,
  ColumnState,
  ExcelStyle,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GridApi,
  GridReadyEvent,
  IRowNode,
  MenuItemDef,
  RowDataUpdatedEvent,
  RowDoubleClickedEvent,
  RowSelectedEvent,
  SelectionColumnDef,
  SideBarDef,
  SizeColumnsToContentStrategy,
  SortChangedEvent,
  StatusPanelDef,
} from 'ag-grid-enterprise';

import { AppRoutePath } from '../../app-route-path.enum';
import {
  COMPONENTS,
  DEFAULT_COLUMN_DEFS,
  ROW_SELECTION,
  SIDE_BAR,
  STATUS_BAR_CONFIG,
} from './config';
import { TableContext } from './config/tablecontext.model';
import { PriceSimulationService } from './services/simulation/price-simulation.service';
import { PriceSourceSimulationService } from './services/simulation/price-source-simulation.service';

@Component({
  selector: 'gq-quotation-details-table',
  templateUrl: './quotation-details-table.component.html',
  styles: [basicTableStyle, statusBarSimulation, statusBarWithBorderStyle],
  standalone: false,
})
export class QuotationDetailsTableComponent
  implements AfterViewChecked, OnInit
{
  @Input() set quotation(quotation: Quotation) {
    this.gridVisible = !this.rowData;
    this.rowData = quotation?.quotationDetails;
    this.tableContext.quotation = quotation;
  }

  private readonly agGridStateService: AgGridStateService =
    inject(AgGridStateService);
  private readonly columnDefinitionService: ColumnDefService =
    inject(ColumnDefService);
  private readonly localizationService: LocalizationService =
    inject(LocalizationService);
  private readonly priceSimulationService = inject(PriceSimulationService);
  private readonly priceSourceSimulationService = inject(
    PriceSourceSimulationService
  );
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly featureToggleService = inject(FeatureToggleConfigService);
  private readonly gridMergeService = inject(GridMergeService);
  private readonly columnUtilityService = inject(ColumnUtilityService);

  autoSizeStrategy: SizeColumnsToContentStrategy = {
    type: 'fitCellContents',
    skipHeader: false,
  };
  sideBar: SideBarDef = SIDE_BAR;
  defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;
  statusBar: { statusPanels: StatusPanelDef[] } = STATUS_BAR_CONFIG;
  components = COMPONENTS;
  rowSelection = ROW_SELECTION;
  selectionColumnDef: SelectionColumnDef = {
    pinned: 'left',
  };
  columnDefs$: Observable<ColDef[]>;
  excelStyles: ExcelStyle[] = excelStyles;
  localeText$: Observable<AgGridLocale>;
  rowData: QuotationDetail[];
  selectedRows: IRowNode[] = [];
  tableContext: TableContext = {
    quotation: undefined,
    onMultipleMaterialSimulation: () => {},
    onPriceSourceSimulation: () => {},
  };
  gridVisible = true;
  gridApi: GridApi;
  colDefChanged = false;
  isFirstColDefEmit = true;

  /**
   * this is a WorkAround AG-GRID has an Issues applying [] for ColumnState and resetColumnState is not restoring the width correctly
   * check https://plnkr.co/edit/d9OkJlsjR8g1YfL1 go to main.ts find in defaultColDef width: 100 is commented out change width of column click resetState --> nothing
   *uncomment the width change width click resetState --> works
   */
  initialColumnStateForDefaultView: ColumnState[] = [];

  simulatedField: ColumnFields;
  simulatedValue: number;
  simulatedPriceSource: PriceSourceOptions;

  selectedQuotationIds: string[] = [];

  ngOnInit(): void {
    this.columnDefs$ = combineLatest([
      this.rolesFacade.getColumnDefsForRolesOnQuotationDetailsTable(
        this.columnDefinitionService.COLUMN_DEFS
      ),
      this.activeCaseFacade.quotationHasFNumberMaterials$,
      this.activeCaseFacade.quotationHasRfqMaterials$,
      this.activeCaseFacade.isSapSyncPending$,
      this.activeCaseFacade.quotation$,
    ]).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => {
        // only hide & refresh grid when column defs are changing AFTER they have already been defined, i.e. after the first commit
        if (!this.isFirstColDefEmit) {
          this.gridVisible = false;
        }
      }),
      map(
        ([
          columnDefs,
          hasFNumberMaterials,
          hasRfqMaterials,
          syncPending,
          quotation,
        ]) => {
          let columnDef = ColumnUtilityService.filterSAPColumns(
            columnDefs,
            quotation
          );

          columnDef = this.featureToggleService.isEnabled('sapPriceDiffColumn')
            ? columnDef
            : ColumnUtilityService.filterSapPriceDiffColumn(columnDef);

          columnDef = this.featureToggleService.isEnabled(
            'targetPriceSourceColumn'
          )
            ? columnDef
            : ColumnUtilityService.filterTargetPriceSourceColumn(columnDef);

          columnDef =
            hasFNumberMaterials && !syncPending
              ? columnDef
              : ColumnUtilityService.filterPricingAssistantColumns(columnDef);

          return hasRfqMaterials
            ? columnDef
            : ColumnUtilityService.filterRfqColumns(columnDef);
        }
      ),
      tap(() => {
        if (!this.isFirstColDefEmit) {
          this.colDefChanged = true;
        }
        this.isFirstColDefEmit = false;
      })
    );

    this.localeText$ = this.localizationService.locale$;
    this.tableContext.onMultipleMaterialSimulation =
      this.onMultipleMaterialSimulation.bind(this);
    this.tableContext.onPriceSourceSimulation =
      this.onPriceSourceSimulation.bind(this);

    this.activeCaseFacade.selectedQuotationDetailIds$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.selectedQuotationIds = val;
      });

    this.activeCaseFacade.simulationModeEnabled$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((enabled) => {
        if (!enabled) {
          this.simulatedField = undefined;
          this.simulatedValue = undefined;
          this.simulatedPriceSource = undefined;
        }
      });

    this.agGridStateService.activeViewId$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((viewId) => viewId === this.agGridStateService.DEFAULT_VIEW_ID)
      )
      .subscribe(() => {
        // when DEFAULT VIEW is selected the default ColumnDefs should be applied
        // see comment for initialColumnStateForDefaultView
        if (this.gridApi) {
          this.gridApi.applyColumnState({
            state: this.initialColumnStateForDefaultView,
            applyOrder: true,
          });
        }
      });
  }

  ngAfterViewChecked(): void {
    // if col def changed try to apply stored column state to prevent overwriting custom views
    if (
      this.colDefChanged &&
      this.gridApi
      // only apply stored column state if the current view is not the default view
    ) {
      this.colDefChanged = false;
      if (
        this.agGridStateService.getCurrentViewId() !==
        this.agGridStateService.DEFAULT_VIEW_ID
      ) {
        this.applyStoredColumnState();
        this.applyStoredFilterState();
      }
    }
    this.gridVisible = true;
  }

  onColumnChange(event: ColumnEvent | SortChangedEvent): void {
    this.updateColumnData(event);
    const viewId = this.agGridStateService.getCurrentViewId();
    const rowDataChanged = event.source === 'gridOptionsChanged';
    const isCustomView = viewId !== this.agGridStateService.DEFAULT_VIEW_ID;

    // if rowDataChanged then the quotation usually got updated -> we can load the stored state
    if (rowDataChanged) {
      this.applyStoredColumnState();
      this.gridVisible = true;
    } else if (isCustomView) {
      this.agGridStateService.setColumnStateForCurrentView(
        event.api.getColumnState(),
        event.source
      );
    }
  }

  onFilterChanged(event: FilterChangedEvent): void {
    const viewId = this.agGridStateService.getCurrentViewId();

    if (viewId !== this.agGridStateService.DEFAULT_VIEW_ID) {
      const filterModels = event.api.getFilterModel();

      this.agGridStateService.setColumnFilterForCurrentView(
        this.tableContext.quotation.gqId.toString(),
        filterModels
      );
    }
  }

  onRowDataUpdated(event: RowDataUpdatedEvent): void {
    this.updateColumnData(event);

    if (this.selectedRows) {
      this.selectedRows.forEach((node: IRowNode) => {
        node.setSelected(true);
      });
    }

    this.selectQuotationDetails(event.api);
  }

  updateColumnData(
    event: FilterChangedEvent | SortChangedEvent | RowDataUpdatedEvent
  ): void {
    const columnData = this.buildColumnData(event);

    this.agGridStateService.setColumnData(
      this.tableContext.quotation.gqId.toString(),
      columnData
    );
  }
  private selectQuotationDetails(
    api: GridApi,
    ensureIndexVisible = false
  ): void {
    api.forEachNode((node) => {
      if (this.selectedQuotationIds.includes(node.data.gqPositionId)) {
        node.setSelected(true);
        // when simulation has been performed or changes made via editing Modal, scroll to the position with the highest rowIndex
        if (ensureIndexVisible) {
          api.ensureIndexVisible(node.rowIndex, 'middle');
        }
      }
    });
  }
  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;

    // when from positionDetailView make sure this row is visible in the table
    if (this.route.snapshot.queryParams.gqPositionId) {
      const index = this.rowData.findIndex(
        (row) =>
          row.gqPositionId === this.route.snapshot.queryParams.gqPositionId
      );
      event.api.ensureIndexVisible(index, 'middle');
    }

    const quotationId = this.tableContext.quotation.gqId.toString();
    if (!this.agGridStateService.getColumnData(quotationId)) {
      const columnData = this.buildColumnData(event);
      this.agGridStateService.setColumnData(quotationId, columnData);
    }

    this.selectQuotationDetails(event.api, true);

    this.agGridStateService.activeViewId$
      .pipe(
        tap(() => this.applyStoredFilterState()),
        skip(1), // first emit is not needed (to execute applyStoredColumnState) as ngAfterViewChecked is being initially executed
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.applyStoredColumnState();
      });
    this.initialColumnStateForDefaultView = event.api.getColumnState();
  }

  onFirstDataRendered(event: FirstDataRenderedEvent): void {
    // highlight the row of the selected quotationDetail
    if (this.route.snapshot.queryParams.gqPositionId) {
      const index = this.rowData.findIndex(
        (row) =>
          row.gqPositionId === this.route.snapshot.queryParams.gqPositionId
      );
      event.api.setFocusedCell(index, ColumnFields.QUOTATION_ITEM_ID);
    }
  }

  onRowSelected(event: RowSelectedEvent): void {
    if (event.node.isSelected()) {
      this.activeCaseFacade.selectQuotationDetail(event.node.data.gqPositionId);
    } else {
      this.activeCaseFacade.deselectQuotationDetail(
        event.node.data.gqPositionId
      );
    }

    this.selectedRows = event.api.getSelectedNodes();
    if (this.simulatedPriceSource && this.selectedRows.length > 0) {
      this.onPriceSourceSimulation(this.simulatedPriceSource);
    }
    if (
      this.selectedRows.length > 0 &&
      this.simulatedField &&
      this.simulatedValue
    ) {
      this.priceSimulationService.simulateSelectedQuotationDetails(
        this.simulatedField,
        this.simulatedValue,
        this.selectedRows,
        this.tableContext.quotation.gqId
      );
    }
    // must be performed when confirming simulation
    else if (this.selectedRows.length === 0) {
      this.simulatedField = undefined;
      this.simulatedValue = undefined;
      this.simulatedPriceSource = undefined;

      this.activeCaseFacade.resetSimulatedQuotation();
    }
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate([AppRoutePath.DetailViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        gqPositionId: event.data.gqPositionId,
      },
    });
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
    const HYPERLINK_COLUMNS: string[] = [
      ColumnFields.QUOTATION_ITEM_ID,
      ColumnFields.RECOMMENDED_PRICE,
      ColumnFields.SAP_PRICE,
    ];

    if (HYPERLINK_COLUMNS.includes(params.column.getColId()) && params.value) {
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

  private readonly buildColumnData = (
    event:
      | FilterChangedEvent
      | SortChangedEvent
      | RowDataUpdatedEvent
      | GridReadyEvent
  ) => {
    const columnData: QuotationDetail[] = [];
    event.api.forEachNodeAfterFilterAndSort((node: IRowNode) => {
      columnData.push(node.data);
    });

    return columnData;
  };

  // Methods for simulation, forwards the simulation to the simulation services
  onMultipleMaterialSimulation(
    simulatedField: ColumnFields,
    value: number,
    isInvalid: boolean
  ) {
    this.simulatedField = simulatedField;
    this.simulatedValue = value;
    this.tableContext.simulatedField = this.simulatedField;
    this.tableContext.simulatedValue = this.simulatedValue;

    if (!isInvalid) {
      this.priceSimulationService.simulateSelectedQuotationDetails(
        simulatedField,
        value,
        this.selectedRows,
        this.tableContext.quotation.gqId
      );
    }
  }

  onPriceSourceSimulation(priceSourceOption: PriceSourceOptions) {
    this.simulatedPriceSource = priceSourceOption;

    this.priceSourceSimulationService.onPriceSourceSimulation(
      priceSourceOption,
      this.tableContext.quotation.gqId,
      this.selectedRows
    );
  }

  private applyStoredColumnState(): void {
    const storedState = this.agGridStateService.getColumnStateForCurrentView();

    if (storedState.length === 0) {
      this.gridApi.resetColumnState();
    } else {
      // merge stored state with new state due to changed col defs
      const activeState = this.gridApi?.getColumnState();
      const initialColIds = this.agGridStateService.getInitialColIds();
      const state = this.gridMergeService.mergeAndReorderColumns(
        storedState,
        activeState,
        initialColIds
      );

      this.gridApi.applyColumnState({
        state,
        applyOrder: true,
      });
    }
  }

  private applyStoredFilterState(): void {
    const quotationId = this.tableContext.quotation.gqId.toString();
    const filterState =
      this.agGridStateService.getColumnFiltersForCurrentView();
    const curFilter = filterState.find(
      (filterVal) => filterVal.actionItemId === quotationId
    );
    this.gridApi?.setFilterModel?.(curFilter?.filterModels || {});
  }
}
