import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { GridOptions } from '@ag-grid-community/all-modules';
import {
  ClientSideRowModelModule,
  ClipboardModule,
  ColDef,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  RowSelectedEvent,
  SetFilterModule,
  SideBarDef,
  SideBarModule,
  SortChangedEvent,
  StatusBarModule,
  StatusPanelDef,
} from '@ag-grid-enterprise/all-modules';
import { GRID_OPTIONS_DEFAULT } from '@cdba/shared/constants/grid-options';
import { ReferenceType } from '@cdba/shared/models';
import { AgGridStateService } from '@cdba/shared/services';
import { arrayEquals } from '@cdba/shared/utils';
import { translate } from '@ngneat/transloco';

import {
  getMainMenuItems,
  SIDE_BAR_CONFIG,
} from '../../shared/components/table';
import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from '../../shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CompareViewButtonComponent } from '../../shared/components/table/custom-status-bar/compare-view-button/compare-view-button.component';
import { DetailViewButtonComponent } from '../../shared/components/table/custom-status-bar/detail-view-button/detail-view-button.component';
import {
  ColumnDefinitionService,
  DEFAULT_COLUMN_DEFINITION,
  STATUS_BAR_CONFIG,
} from './config';
import { PcmCellRendererComponent } from './pcm-cell-renderer/pcm-cell-renderer.component';
import { TableStore } from './table.store';

@Component({
  selector: 'cdba-reference-types-table',
  templateUrl: './reference-types-table.component.html',
})
export class ReferenceTypesTableComponent implements OnInit, OnChanges {
  private static readonly TABLE_KEY = 'referenceTypes';

  @Input() public rowData: ReferenceType[];
  @Input() public selectedNodeIds: string[];
  @Output() readonly selectionChange: EventEmitter<string[]> =
    new EventEmitter();

  public modules = [
    ClientSideRowModelModule,
    FiltersToolPanelModule,
    ColumnsToolPanelModule,
    MenuModule,
    RangeSelectionModule,
    RowGroupingModule,
    StatusBarModule,
    ClipboardModule,
    SetFilterModule,
    SideBarModule,
  ];

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = this.columnDefinitionService.COLUMN_DEFINITIONS;

  public gridOptions: GridOptions = GRID_OPTIONS_DEFAULT;

  public rowSelection = 'multiple';

  public rowHeight = 30;

  public frameworkComponents = {
    detailViewButtonComponent: DetailViewButtonComponent,
    compareViewButtonComponent: CompareViewButtonComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
    pcmCellRenderer: PcmCellRendererComponent,
  };

  public noRowsOverlayComponent = 'customNoRowsOverlay';
  public noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => translate('results.referenceTypesTable.noRowsMessage'),
  };

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG;

  public sideBar: SideBarDef = SIDE_BAR_CONFIG;

  public selectedRows: string[] = [];

  public getMainMenuItems = getMainMenuItems;

  private gridApi: GridApi;

  private tableFilters: any;

  public constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefinitionService,
    private readonly tableStore: TableStore
  ) {}

  public ngOnInit(): void {
    this.tableStore.filters$.subscribe(
      (filters) => (this.tableFilters = filters)
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && this.gridApi) {
      this.gridApi.setRowData(changes.rowData.currentValue);
    }
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
    params.columnApi.setColumnVisible('identificationHash', false);

    params.api.setFilterModel(this.tableFilters);
    this.selectNodes();
  }

  /**
   * Limit selected rows to a maximum
   */
  public onRowSelected({ node, api }: RowSelectedEvent): void {
    const maxLength = 25;

    const previouslySelectedRows = [...this.selectedRows];

    const { id } = node;
    const selected = node.isSelected();

    this.selectedRows = selected
      ? [...this.selectedRows, id]
      : this.selectedRows.filter((entry: string) => entry !== id);

    if (this.selectedRows.length > maxLength) {
      api.getRowNode(this.selectedRows.shift()).setSelected(false, false, true);
    }

    if (!arrayEquals(this.selectedRows, previouslySelectedRows)) {
      this.selectionChange.emit(this.selectedRows);
    }
  }

  private selectNodes(): void {
    if (this.selectedNodeIds) {
      this.selectedNodeIds.forEach((id) =>
        this.gridApi.getRowNode(id).setSelected(true, true, true)
      );
    }
  }

  public filterChange(): void {
    const filters = this.gridApi.getFilterModel();

    this.tableStore.setFilters(filters);
  }
}
