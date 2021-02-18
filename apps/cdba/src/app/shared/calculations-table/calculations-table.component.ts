import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  ColDef,
  Column,
  ColumnEvent,
  GridApi,
  GridReadyEvent,
  IStatusPanelParams,
  RowSelectedEvent,
  SideBarDef,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';

import { environment } from '../../../environments/environment';
import { Calculation } from '../../core/store/reducers/shared/models/calculation.model';
import { AgGridStateService } from '../services/ag-grid-state.service';
import { getMainMenuItems, SIDE_BAR_CONFIG } from '../table';
import { NoRowsParams } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import {
  ColumnDefinitionService,
  DEFAULT_COLUMN_DEFINITION,
  FRAMEWORK_COMPONENTS,
  FRAMEWORK_COMPONENTS_MINIFIED,
  MODULES,
  MODULES_MINIFIED,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'cdba-calculations-table',
  templateUrl: './calculations-table.component.html',
  styleUrls: ['./calculations-table.component.scss'],
})
export class CalculationsTableComponent implements OnInit, OnChanges {
  private static readonly TABLE_KEY = 'calculations';

  private gridApi: GridApi;

  @Input() minified = false;
  @Input() rowData: Calculation[];
  @Input() selectedNodeId: string;
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

  @Output() readonly selectionChange: EventEmitter<{
    nodeId: string;
    calculation: Calculation;
  }> = new EventEmitter();

  public modules: any[];

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = Object.values(
    this.columnDefinitionService.COLUMN_DEFINITIONS
  );

  public frameworkComponents: any;

  public noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => this.errorMessage,
  };

  public loadingOverlayComponent = 'customLoadingOverlay';
  public noRowsOverlayComponent = 'customNoRowsOverlay';

  public statusBar: {
    statusPanels: StatusPanelDef[];
  };

  public sideBar: SideBarDef;
  public rowSelection = !environment.production ? 'multiple' : 'single';
  public enableRangeSelection: boolean;
  public rowGroupPanelShow: string;
  public selectedRows: number[] = [];

  public getMainMenuItems = getMainMenuItems;

  public constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefinitionService
  ) {}

  ngOnInit(): void {
    this.setTableProperties(this.minified);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.gridApi) {
      return;
    }

    if (changes.isLoading && changes.isLoading.currentValue) {
      this.gridApi.showLoadingOverlay();
    } else {
      this.gridApi.showNoRowsOverlay();
    }
  }

  /**
   * Limit selected rows to a maximum of two
   */
  public onRowSelected({ node, api }: RowSelectedEvent): void {
    const id = +node.id;
    const selected = node.isSelected();

    this.selectedRows = selected
      ? [...this.selectedRows, id]
      : this.selectedRows.filter((entry: number) => entry !== id);

    if (this.selectedRows.length === 1) {
      const nodeId = `${this.selectedRows[0]}`;
      const calculation = api.getSelectedRows()[0];
      this.selectionChange.emit({ nodeId, calculation });
    } else if (this.selectedRows.length > 2) {
      api.deselectIndex(this.selectedRows.shift());
    }
  }

  public onFirstDataRendered(params: IStatusPanelParams): void {
    if (this.selectedNodeId) {
      this.gridApi
        .getRowNode(this.selectedNodeId)
        .setSelected(true, true, true);
    }

    this.gridApi.dispatchEvent(new Event('customSetSelection'));
    params.columnApi.autoSizeColumns(
      params.columnApi
        .getAllColumns()
        .filter((column: Column) => column.getId() !== 'checkbox'),
      this.minified
    );
  }

  /**
   * Column change listener for table.
   */
  public columnChange(event: ColumnEvent): void {
    const columnState = event.columnApi.getColumnState();

    this.agGridStateService.setColumnState(
      CalculationsTableComponent.TABLE_KEY,
      columnState
    );
  }

  private setTableProperties(minified: boolean): void {
    this.defaultColDef = { ...this.defaultColDef, floatingFilter: !minified };
    this.sideBar = minified ? undefined : SIDE_BAR_CONFIG;
    this.statusBar = minified ? undefined : STATUS_BAR_CONFIG;
    this.frameworkComponents = minified
      ? FRAMEWORK_COMPONENTS_MINIFIED
      : FRAMEWORK_COMPONENTS;

    this.modules = minified ? MODULES_MINIFIED : MODULES;

    this.enableRangeSelection = minified ? false : true;
    this.rowGroupPanelShow = minified ? 'never' : 'always';
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    const state = this.agGridStateService.getColumnState(
      CalculationsTableComponent.TABLE_KEY
    );

    params.columnApi.applyColumnState({
      state,
      applyOrder: true,
    });

    if (!this.isLoading) {
      this.gridApi.showNoRowsOverlay();
    }
  }
}
