import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import {
  ColDef,
  ColumnEvent,
  ColumnRowGroupChangedEvent,
  ColumnState,
  DisplayedColumnsChangedEvent,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowSelectionOptions,
  SelectionChangedEvent,
  SelectionColumnDef,
  SideBarDef,
  SortChangedEvent,
  StatusPanelDef,
} from 'ag-grid-enterprise';

import { getPaginationState, updatePaginationState } from '@cdba/core/store';
import { PaginationState } from '@cdba/core/store/reducers/search/search.reducer';
import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { PaginationControlsService } from '@cdba/shared/components/table/pagination-controls/service/pagination-controls.service';
import { SideBarService } from '@cdba/shared/components/table/side-bar/side-bar.service';
import { ResultsStatusBarComponent } from '@cdba/shared/components/table/status-bar/results-status-bar';
import {
  DEFAULT_GRID_OPTIONS,
  DEFAULT_ROW_SELECTION,
  DEFAULT_SELECTION_COLUMN_DEF,
} from '@cdba/shared/constants/grid-config';
import {
  MIN_PAGE_SIZE,
  PAGINATION_LOADING_TIMEOUT,
} from '@cdba/shared/constants/pagination';
import { ReferenceType } from '@cdba/shared/models';
import { AgGridStateService } from '@cdba/shared/services';

import { getMainMenuItems } from '../../shared/components/table';
import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from '../../shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import {
  ColumnDefinitionService,
  DEFAULT_COLUMN_DEFINITION,
  STATUS_BAR_CONFIG,
} from './config';
import { MaterialDesignationCellRenderComponent } from './material-designation-cell-render/material-designation-cell-render.component';
import { PcmCellRendererComponent } from './pcm-cell-renderer/pcm-cell-renderer.component';
import { TableStore } from './table.store';

@Component({
  selector: 'cdba-reference-types-table',
  templateUrl: './reference-types-table.component.html',
  standalone: false,
})
export class ReferenceTypesTableComponent implements OnInit, OnDestroy {
  private static readonly TABLE_KEY = 'referenceTypes';

  @Input() selectedNodeIds: string[];
  @Input() rowData: ReferenceType[];

  @Output() readonly selectionChange: EventEmitter<string[]> =
    new EventEmitter();

  defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  columnDefs: ColDef[] = this.columnDefinitionService.COLUMN_DEFINITIONS;
  gridOptions: GridOptions = DEFAULT_GRID_OPTIONS;
  selectionColumnDef: SelectionColumnDef = DEFAULT_SELECTION_COLUMN_DEF;
  rowSelection: RowSelectionOptions = DEFAULT_ROW_SELECTION;

  rowHeight = 30;

  paginationState: PaginationState;
  paginationState$ = this.store.select(getPaginationState);

  components = {
    customLoadingOverlay: CustomLoadingOverlayComponent,
    resultsStatusBarComponent: ResultsStatusBarComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
    materialDesignationCellRender: MaterialDesignationCellRenderComponent,
    pcmCellRenderer: PcmCellRendererComponent,
  };

  noRowsOverlayComponent = 'customNoRowsOverlay';
  noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => translate('results.referenceTypesTable.noRowsMessage'),
  };
  loadingOverlayComponent = 'customLoadingOverlay';

  statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG;

  icons = this.sidebarService.ICONS;

  sideBar: SideBarDef = this.sidebarService.NAVIGATE_SIDE_BAR_CONFIG;

  getMainMenuItems = getMainMenuItems;

  private gridApi: GridApi;

  private tableFilters: Record<string, any>;

  private filtersSubscription: Subscription = new Subscription();
  private paginationStateSubscription: Subscription = new Subscription();

  constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefinitionService,
    private readonly paginationControlsService: PaginationControlsService,
    private readonly sidebarService: SideBarService,
    private readonly tableStore: TableStore,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.filtersSubscription = this.tableStore.filters$.subscribe({
      next: (filters) => (this.tableFilters = filters),
    });

    this.paginationStateSubscription = this.paginationState$.subscribe({
      next: (state: PaginationState) => (this.paginationState = state),
    });

    if (this.paginationState === undefined) {
      this.paginationControlsService.setupInitialPaginationState(
        this.rowData?.length
      );
    }
  }

  ngOnDestroy(): void {
    this.filtersSubscription.unsubscribe();
    this.paginationStateSubscription.unsubscribe();
  }

  /**
   * Column change listener for table.
   */
  onColumnChange(event: SortChangedEvent | ColumnEvent): void {
    const columnState = event.api.getColumnState();

    this.agGridStateService.setColumnState(
      ReferenceTypesTableComponent.TABLE_KEY,
      columnState
    );
  }

  /**
   * Set the checkbox column to be the first column in the table after reset.
   */
  // DSCDA-3355
  onDisplayedColumnsChanged(event: DisplayedColumnsChangedEvent): void {
    if (event.source === 'columnMenu' || event.source === 'api') {
      const checkboxColIndex = event.api
        .getColumnState()
        .findIndex((col) => col.colId === 'ag-Grid-ControlsColumn');
      if (checkboxColIndex !== -1 && checkboxColIndex !== 0) {
        event.api.moveColumnByIndex(checkboxColIndex, 0);
      }
    }
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;

    const columnState = this.agGridStateService.getColumnState(
      ReferenceTypesTableComponent.TABLE_KEY
    );

    if (columnState) {
      this.shiftToFront(columnState, 'materialDesignation');
      this.shiftToFront(columnState, 'ag-Grid-ControlsColumn');

      event.api.applyColumnState({
        state: columnState,
        applyOrder: true,
      });
    }

    if (this.paginationState.currentPage !== 0) {
      this.gridApi.paginationGoToPage(this.paginationState.currentPage);
    }

    // Hide pagination component when row grouping is active
    if (event.api.getRowGroupColumns().length > 0) {
      this.paginationControlsService.setVisible(false);
    } else {
      this.paginationControlsService.setVisible(true);
    }
  }

  /**
   * Autosize columns width when data is loaded.
   */
  onFirstDataRendered(params: FirstDataRenderedEvent): void {
    params.api.autoSizeAllColumns(false);
    params.api.setFilterModel(this.tableFilters);
    this.selectNodes();
    params.api.refreshHeader();
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    this.selectionChange.emit(event.api.getSelectedNodes().map((el) => el.id));
  }

  /**
   * React upon user grouping columns.
   * When row grouping is active AG Grid displays whole dataset in the table making
   * custom pagination component unusable.
   */
  onColumnRowGroupChanged(event: ColumnRowGroupChangedEvent): void {
    if (event.source === 'toolPanelUi') {
      let isVisible: boolean;
      if (event.columns.length === 1 && !event.columns[0].isRowGroupActive()) {
        isVisible = true;
      } else if (
        event.columns.length === 1 &&
        event.columns[0].isRowGroupActive()
      ) {
        isVisible = false;
      } else if (event.columns.length > 1) {
        isVisible = false;
      }
      this.paginationControlsService.setVisible(isVisible);
    }
  }

  onFilterChange(evt: FilterChangedEvent): void {
    this.tableStore.setFilters(this.gridApi.getFilterModel());

    this.paginationControlsService.disablePagination();
    evt.api.setGridOption('loading', true);

    setTimeout(() => {
      let currentPage = this.paginationState.currentPage;
      if (evt.api.paginationGetCurrentPage() !== 0) {
        currentPage = 0;
        evt.api.paginationGoToFirstPage();
      }

      const displayedRowCount = evt.api.getDisplayedRowCount();
      const pageSize =
        this.paginationState.pageSize === 0 ||
        this.paginationState.pageSize === undefined
          ? MIN_PAGE_SIZE
          : this.paginationState.pageSize;
      const totalPages = Math.ceil(displayedRowCount / pageSize);
      const indexes = this.paginationControlsService.calculateRangeIndexes(
        currentPage,
        pageSize,
        this.paginationState.totalRange
      );

      this.store.dispatch(
        updatePaginationState({
          paginationState: {
            ...this.paginationState,
            currentPage,
            isEnabled: true,
            totalPages: totalPages === 0 ? 1 : totalPages,
            totalRange: displayedRowCount,
            currentRangeStartIndex: indexes.currentRangeStartIndex,
            currentRangeEndIndex: indexes.currentRangeEndIndex,
          } as PaginationState,
        })
      );
      evt.api.setGridOption('loading', false);
    }, PAGINATION_LOADING_TIMEOUT);
  }

  private shiftToFront(columnState: ColumnState[], columnName: string) {
    const columnIndex = columnState.findIndex(
      (col) => col.colId === columnName
    );
    if (columnIndex !== -1) {
      const column = columnState.splice(columnIndex, 1);
      columnState.splice(0, 0, column[0]);
    }
  }

  private selectNodes(): void {
    if (this.selectedNodeIds) {
      const nodes = this.selectedNodeIds.map((id) =>
        this.gridApi.getRowNode(id)
      );
      this.gridApi.setNodesSelected({ nodes, newValue: true, source: 'api' });
    }
  }
}
