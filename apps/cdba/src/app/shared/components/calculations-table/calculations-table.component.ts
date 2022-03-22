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
  GridApi,
  GridReadyEvent,
  RowSelectedEvent,
  SideBarDef,
  SortChangedEvent,
  StatusPanelDef,
} from '@ag-grid-enterprise/all-modules';
import { COMPARE_ITEMS_MAX_COUNT } from '@cdba/shared/constants/table';
import { arrayEquals } from '@cdba/shared/utils';

import { Calculation } from '../../models';
import { AgGridStateService } from '../../services';
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
})
export class CalculationsTableComponent implements OnInit, OnChanges {
  @Input() minified = false;
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

  public modules: any[];

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[];

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
  public rowSelection: 'multiple' | 'single';
  public enableRangeSelection: boolean;
  public rowGroupPanelShow: string;

  public getMainMenuItems = getMainMenuItems;

  private gridApi: GridApi;
  private storageKey: string;

  public constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefinitionService
  ) {}

  ngOnInit(): void {
    this.columnDefs = this.columnDefinitionService.getColDef(this.minified);
    this.storageKey = `calculations_${this.minified ? 'minified' : 'default'}`;
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
    setTimeout(() => {
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
        api.getRowNode(newSelectedRows.shift()).setSelected(false, false, true);
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
          api
            .getRowNode(previouslySelectedRows.shift())
            .setSelected(true, false, true);

          return;
        }

        this.selectionChange.emit(selections);
      }
    }, 0);
  }

  public onFirstDataRendered(): void {
    this.selectNodes();
  }

  /**
   * Column change listener for table.
   */
  public columnChange(event: SortChangedEvent): void {
    const columnState = event.columnApi.getColumnState();

    this.agGridStateService.setColumnState(this.storageKey, columnState);
  }

  public onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    const state = this.agGridStateService.getColumnState(this.storageKey);

    params.columnApi.applyColumnState({
      state,
      applyOrder: true,
    });

    if (!this.isLoading) {
      this.gridApi.showNoRowsOverlay();
    }
  }

  private setTableProperties(minified: boolean): void {
    this.defaultColDef = { ...this.defaultColDef, floatingFilter: !minified };
    this.sideBar = minified ? undefined : SIDE_BAR_CONFIG;
    this.statusBar = minified ? undefined : STATUS_BAR_CONFIG;
    this.frameworkComponents = minified
      ? FRAMEWORK_COMPONENTS_MINIFIED
      : FRAMEWORK_COMPONENTS;

    this.modules = minified ? MODULES_MINIFIED : MODULES;

    this.rowSelection = 'multiple';
    this.enableRangeSelection = !minified;
    this.rowGroupPanelShow = minified ? 'never' : 'always';
  }

  private selectNodes(): void {
    if (this.selectedNodeIds) {
      setTimeout(() => {
        this.selectedNodeIds.forEach((id) =>
          this.gridApi.getRowNode(id).setSelected(true, true, true)
        );
      }, 0);
    }
  }
}
