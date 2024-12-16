import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import {
  ColumnRowGroupChangedEvent,
  FirstDataRenderedEvent,
  GridOptions,
  GridReadyEvent,
  SelectionChangedEvent,
  SortChangedEvent,
} from 'ag-grid-community';
import {
  ColDef,
  GridApi,
  SideBarDef,
  StatusPanelDef,
} from 'ag-grid-enterprise';

import { getPaginationState, updatePaginationState } from '@cdba/core/store';
import { PaginationState } from '@cdba/core/store/reducers/search/search.reducer';
import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { PaginationControlsService } from '@cdba/shared/components/table/pagination-controls/service/pagination-controls.service';
import { ResultsStatusBarComponent } from '@cdba/shared/components/table/status-bar/results-status-bar';
import { GRID_OPTIONS_DEFAULT } from '@cdba/shared/constants/grid-options';
import { MIN_PAGE_SIZE } from '@cdba/shared/constants/pagination';
import { ReferenceType } from '@cdba/shared/models';
import { AgGridStateService } from '@cdba/shared/services';

import {
  getMainMenuItems,
  SIDE_BAR_CONFIG,
} from '../../shared/components/table';
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
})
export class ReferenceTypesTableComponent
  implements OnInit, OnChanges, OnDestroy
{
  private static readonly TABLE_KEY = 'referenceTypes';

  @Input() public selectedNodeIds: string[];
  @Input() public rowData: ReferenceType[];

  @Output() readonly selectionChange: EventEmitter<string[]> =
    new EventEmitter();

  defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  columnDefs: ColDef[] = this.columnDefinitionService.COLUMN_DEFINITIONS;

  gridOptions: GridOptions = GRID_OPTIONS_DEFAULT;

  rowSelection = 'multiple';

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

  sideBar: SideBarDef = SIDE_BAR_CONFIG;

  getMainMenuItems = getMainMenuItems;

  private gridApi: GridApi;

  private tableFilters: Record<string, any>;

  private filtersSubscription: Subscription = new Subscription();
  private paginationStateSubscription: Subscription = new Subscription();

  constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefinitionService,
    private readonly paginationControlsService: PaginationControlsService,
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
      this.setupInitialPaginationState();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && this.gridApi) {
      this.gridApi.setRowData(changes.rowData.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.filtersSubscription.unsubscribe();
    this.paginationStateSubscription.unsubscribe();
  }

  /**
   * Column change listener for table.
   */
  columnChange(event: SortChangedEvent): void {
    const columnState = event.columnApi.getColumnState();

    this.agGridStateService.setColumnState(
      ReferenceTypesTableComponent.TABLE_KEY,
      columnState
    );
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;

    const state = this.agGridStateService.getColumnState(
      ReferenceTypesTableComponent.TABLE_KEY
    );

    event.columnApi.applyColumnState({
      state,
      applyOrder: true,
    });

    event.api.setRowData(this.rowData);

    if (this.paginationState.currentPage !== 0) {
      this.gridApi.paginationGoToPage(this.paginationState.currentPage);
    }

    // Hide pagination component when row grouping is active
    if (event.columnApi.getRowGroupColumns().length > 0) {
      this.store.dispatch(
        updatePaginationState({
          paginationState: {
            ...this.paginationState,
            isVisible: false,
          } as PaginationState,
        })
      );
    } else {
      this.store.dispatch(
        updatePaginationState({
          paginationState: {
            ...this.paginationState,
            isVisible: true,
          } as PaginationState,
        })
      );
    }
  }

  /**
   * Autosize columns width when data is loaded.
   */
  onFirstDataRendered(params: FirstDataRenderedEvent): void {
    params.columnApi.autoSizeAllColumns(false);

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
      this.store.dispatch(
        updatePaginationState({
          paginationState: {
            ...this.paginationState,
            isVisible,
          } as PaginationState,
        })
      );
    }
  }

  filterChange(): void {
    const filters = this.gridApi.getFilterModel();

    this.tableStore.setFilters(filters);
  }

  private selectNodes(): void {
    if (this.selectedNodeIds) {
      const nodes = this.selectedNodeIds.map((id) =>
        this.gridApi.getRowNode(id)
      );
      this.gridApi.setNodesSelected({ nodes, newValue: true, source: 'api' });
    }
  }

  private setupInitialPaginationState(): void {
    const pageSize =
      this.paginationControlsService.getPageSizeFromLocalStorage();
    this.store.dispatch(
      updatePaginationState({
        paginationState: {
          isVisible: true,
          isDisabled: this.rowData?.length <= MIN_PAGE_SIZE,
          currentPage: 0,
          pageSize,
          totalPages: Math.ceil(this.rowData?.length / pageSize),
          totalRange: this.rowData?.length,
        } as PaginationState,
      })
    );
  }
}
