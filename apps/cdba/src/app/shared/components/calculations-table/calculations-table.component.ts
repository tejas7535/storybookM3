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
  ColumnEvent,
  GridApi,
  GridReadyEvent,
  IRowNode,
  RowSelectedEvent,
  RowSelectionOptions,
  SelectionColumnDef,
  SideBarDef,
  SortChangedEvent,
  StatusPanelDef,
} from 'ag-grid-enterprise';

import { COMPARE_ITEMS_MAX_COUNT } from '@cdba/shared/constants/table';
import { arrayEquals } from '@cdba/shared/utils';

import { Calculation } from '../../models';
import { AgGridStateService } from '../../services';
import { getMainMenuItems, SIDE_BAR_CONFIG } from '../table';
import { NoRowsParams } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import {
  ColumnDefinitionService,
  DEFAULT_COLUMN_DEFINITION,
  DEFAULT_SELECTION_COLUMN_DEFINITION,
  FRAMEWORK_COMPONENTS,
  FRAMEWORK_COMPONENTS_MINIFIED,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'cdba-calculations-table',
  templateUrl: './calculations-table.component.html',
})
export class CalculationsTableComponent implements OnInit, OnChanges {
  @Input() minified = false;
  @Input() rowSelectionType: 'singleRow' | 'multiRow';
  @Input() enableSelectionWithoutKeys = false;
  @Input() rowData: Calculation[];
  @Input() selectedNodeIds: string[];
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

  @Output() readonly selectionChange: EventEmitter<
    {
      nodeId: string;
      calculation: Calculation;
    }[]
  > = new EventEmitter();

  modules: any[];
  components: any;
  sideBar: SideBarDef;
  cellSelection: boolean;
  statusBar: {
    statusPanels: StatusPanelDef[];
  };

  defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  columnDefs: ColDef[];
  rowSelection: RowSelectionOptions;
  selectionColumnDef: SelectionColumnDef;

  noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => this.errorMessage,
  };

  loadingOverlayComponent = 'customLoadingOverlay';
  noRowsOverlayComponent = 'customNoRowsOverlay';
  radioButtonCellRenderComponent = 'radioButtonCellRenderComponent';

  rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never';

  getMainMenuItems = getMainMenuItems;

  private gridApi: GridApi;
  private storageKey: string;

  constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefinitionService
  ) {}

  ngOnInit(): void {
    this.storageKey = `calculations_${this.minified ? 'minified' : 'default'}`;
    this.setTableProperties(this.minified);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.gridApi) {
      return;
    }

    if (changes.isLoading && changes.isLoading.currentValue) {
      this.gridApi.setGridOption('loading', true);
    } else {
      this.gridApi.showNoRowsOverlay();
    }
  }

  /**
   * Limit selected rows to a maximum of two
   */
  onRowSelected(evt: RowSelectedEvent): void {
    setTimeout(() => {
      // Ignore programatical row selections
      if (evt.source === 'api') {
        return;
      }

      const node = evt.node;
      const api = evt.api;

      const maxLength = this.minified ? 1 : COMPARE_ITEMS_MAX_COUNT;

      const previouslySelectedRows = this.selectedNodeIds
        ? [...this.selectedNodeIds]
        : [];

      const { id } = node;
      const selected = node.isSelected();

      const newSelectedRows = selected
        ? [...new Set(this.selectedNodeIds).add(id)]
        : previouslySelectedRows.filter((entry: string) => entry !== id);

      if (newSelectedRows.length > maxLength) {
        const latestSelectedNode = api.getRowNode(newSelectedRows.shift());
        api.setNodesSelected({
          nodes: [latestSelectedNode],
          newValue: false,
          source: 'api',
        });
      }

      if (!arrayEquals<string>(newSelectedRows, previouslySelectedRows)) {
        const selections: {
          nodeId: string;
          calculation: Calculation;
        }[] = newSelectedRows.map((nodeId) => ({
          nodeId,
          calculation: api.getRowNode(nodeId).data,
        }));

        // keep at least one item selected in minified version
        if (this.minified && selections?.length === 0) {
          const latestSelectedNode = api.getRowNode(
            previouslySelectedRows.shift()
          );

          api.setNodesSelected({
            nodes: [latestSelectedNode],
            newValue: true,
            source: 'api',
          });

          return;
        }

        this.selectionChange.emit(selections);
      }
    }, 0);
  }

  onFirstDataRendered(): void {
    this.selectNodes();
  }

  /**
   * Column change listener for table.
   */
  columnChange(event: ColumnEvent | SortChangedEvent): void {
    const columnState = event.api.getColumnState();

    this.agGridStateService.setColumnState(this.storageKey, columnState);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    const state = this.agGridStateService.getColumnState(this.storageKey);

    params.api.applyColumnState({
      state,
      applyOrder: true,
    });

    if (!this.isLoading) {
      this.gridApi.showNoRowsOverlay();
    }
  }

  private setTableProperties(minified: boolean): void {
    this.columnDefs = this.columnDefinitionService.getColDef();
    this.defaultColDef = { ...this.defaultColDef, floatingFilter: !minified };

    this.sideBar = minified ? undefined : SIDE_BAR_CONFIG;
    this.statusBar = minified ? undefined : STATUS_BAR_CONFIG;

    this.components = minified
      ? FRAMEWORK_COMPONENTS_MINIFIED
      : FRAMEWORK_COMPONENTS;

    this.cellSelection = !minified;
    this.rowGroupPanelShow = minified ? 'never' : 'always';

    this.rowSelection = {
      mode: this.rowSelectionType,
      checkboxes: true,
      headerCheckbox: false,
      enableClickSelection: true,
      enableSelectionWithoutKeys: this.enableSelectionWithoutKeys,
    } as RowSelectionOptions;

    this.selectionColumnDef = DEFAULT_SELECTION_COLUMN_DEFINITION;
  }

  private selectNodes(): void {
    if (this.selectedNodeIds) {
      setTimeout(() => {
        let latestSelectedNodes: IRowNode[];

        if (this.selectedNodeIds.length === 2) {
          latestSelectedNodes = [
            this.gridApi.getRowNode(this.selectedNodeIds[0]),
            this.gridApi.getRowNode(this.selectedNodeIds[1]),
          ];
        } else {
          latestSelectedNodes = [
            this.gridApi.getRowNode(this.selectedNodeIds[0]),
          ];
          this.selectedNodeIds = this.selectedNodeIds.slice(1);
        }

        this.gridApi.setNodesSelected({
          nodes: latestSelectedNodes,
          newValue: true,
          source: 'api',
        });
      }, 0);
    }
  }
}
