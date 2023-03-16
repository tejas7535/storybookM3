import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import {
  ColDef,
  GridApi,
  GridReadyEvent,
  StatusPanelDef,
} from 'ag-grid-community';

import { BomItem, Calculation, RawMaterialAnalysis } from '@cdba/shared/models';

import { getMainMenuItems } from '../table/column-utils';
import { NoRowsParams } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import {
  ColumnDefinitionService,
  FRAMEWORK_COMPONENTS,
  STATUS_BAR_CONFIG,
} from './config';
import { DEFAULT_COLUMN_DEFINITION } from './config/default-column-definition';

@Component({
  selector: 'cdba-raw-material-analysis-table',
  templateUrl: './raw-material-analysis-table.component.html',
  styles: [],
})
export class RawMaterialAnalysisTableComponent implements OnInit, OnChanges {
  public odataFeatureEnabled: boolean;

  @Input() materialDesignation: string;
  @Input() selectedBomItem: BomItem;
  @Input() selectedCalculation: Calculation;

  @Input() rawMaterialAnalysisData: RawMaterialAnalysis[];
  @Input() rawMaterialAnalysisSummary: RawMaterialAnalysis[];
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

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
