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
import {
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

import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { PaginationControlsService } from '@cdba/shared/components/table/pagination-controls/service/pagination-controls.service';
import { ResultsStatusBarComponent } from '@cdba/shared/components/table/status-bar/results-status-bar';
import { GRID_OPTIONS_DEFAULT } from '@cdba/shared/constants/grid-options';
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

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = this.columnDefinitionService.COLUMN_DEFINITIONS;

  public gridOptions: GridOptions = GRID_OPTIONS_DEFAULT;

  public rowSelection = 'multiple';

  public rowHeight = 30;

  public pagination = true;
  public paginationPageSize: number;

  public components = {
    customLoadingOverlay: CustomLoadingOverlayComponent,
    resultsStatusBarComponent: ResultsStatusBarComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
    materialDesignationCellRender: MaterialDesignationCellRenderComponent,
    pcmCellRenderer: PcmCellRendererComponent,
  };

  public noRowsOverlayComponent = 'customNoRowsOverlay';
  public noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => translate('results.referenceTypesTable.noRowsMessage'),
  };
  loadingOverlayComponent = 'customLoadingOverlay';

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG;

  public sideBar: SideBarDef = SIDE_BAR_CONFIG;

  public getMainMenuItems = getMainMenuItems;

  private gridApi: GridApi;

  private tableFilters: any;

  private filtersSubscription: Subscription = new Subscription();

  public constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefinitionService,
    private readonly paginationControlsService: PaginationControlsService,
    private readonly tableStore: TableStore
  ) {}

  public ngOnInit(): void {
    this.filtersSubscription = this.tableStore.filters$.subscribe(
      (filters) => (this.tableFilters = filters)
    );

    this.paginationPageSize = this.paginationControlsService.getPageSize();

    this.paginationControlsService.pages = Math.ceil(
      this.rowData.length / this.paginationPageSize
    );
    this.paginationControlsService.range = this.rowData.length;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && this.gridApi) {
      this.gridApi.setRowData(changes.rowData.currentValue);
    }
  }

  public ngOnDestroy(): void {
    this.filtersSubscription.unsubscribe();
  }

  /**
   * Column change listener for table.
   */
  public columnChange(event: SortChangedEvent): void {
    const columnState = event.columnApi.getColumnState();

    this.agGridStateService.setColumnState(
      ReferenceTypesTableComponent.TABLE_KEY,
      columnState
    );
  }

  public onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;

    const state = this.agGridStateService.getColumnState(
      ReferenceTypesTableComponent.TABLE_KEY
    );

    event.columnApi.applyColumnState({
      state,
      applyOrder: true,
    });

    event.api.setRowData(this.rowData);
  }

  /**
   * Autosize columns width when data is loaded.
   */
  public onFirstDataRendered(params: FirstDataRenderedEvent): void {
    params.columnApi.autoSizeAllColumns(false);

    params.api.setFilterModel(this.tableFilters);
    this.selectNodes();
    params.api.refreshHeader();
  }

  public onSelectionChanged(event: SelectionChangedEvent): void {
    this.selectionChange.emit(event.api.getSelectedNodes().map((el) => el.id));
  }

  public filterChange(): void {
    const filters = this.gridApi.getFilterModel();

    this.tableStore.setFilters(filters);
  }

  private selectNodes(): void {
    if (this.selectedNodeIds) {
      this.selectedNodeIds.forEach((id) =>
        this.gridApi.getRowNode(id).setSelected(true, true, true)
      );
    }
  }
}
