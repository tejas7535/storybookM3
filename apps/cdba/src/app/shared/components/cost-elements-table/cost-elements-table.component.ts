import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { GridReadyEvent } from 'ag-grid-community';
import { ColDef, GridApi, StatusPanelDef } from 'ag-grid-enterprise';

import { BomItem, Calculation, CostComponentSplit } from '@cdba/shared/models';

import { getMainMenuItems } from '../table';
import { NoRowsParams } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import {
  ColumnDefinitionService,
  DEFAULT_COLUMN_DEFINITION,
  FRAMEWORK_COMPONENTS,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'cdba-cost-elements-table',
  templateUrl: './cost-elements-table.component.html',
})
export class CostElementsTableComponent implements OnInit, OnChanges {
  @Input() materialDesignation: string;
  @Input() selectedBomItem: BomItem;
  @Input() selectedCalculation: Calculation;

  @Input() costElementsData: CostComponentSplit[];
  @Input() costElementsSummary: CostComponentSplit[];
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

  @Input() index: number;

  public odataFeatureEnabled: boolean;

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[];

  public components: any;

  public noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => this.errorMessage,
  };

  public loadingOverlayComponent = 'customLoadingOverlay';
  public noRowsOverlayComponent = 'customNoRowsOverlay';

  public getMainMenuItems = getMainMenuItems;
  public statusBar: {
    statusPanels: StatusPanelDef[];
  };
  public modules: any[];

  private gridApi: GridApi;

  constructor(
    private readonly columnDefinitionService: ColumnDefinitionService
  ) {}

  ngOnInit(): void {
    this.columnDefs = this.columnDefinitionService.getColDef();
    this.statusBar = STATUS_BAR_CONFIG;
    this.components = FRAMEWORK_COMPONENTS;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.gridApi) {
      return;
    }

    if (changes.isLoading?.currentValue) {
      /**
       * timeout is necessary, so that the table can meanwhile check, if there is data to display or not
       * the table only shows overlays, if there is no data to display
       */
      setTimeout(() => this.gridApi.showLoadingOverlay(), 10);
    } else {
      this.gridApi.showNoRowsOverlay();
    }
  }

  public onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    if (!this.isLoading) {
      this.gridApi.showNoRowsOverlay();
    }
  }
}
