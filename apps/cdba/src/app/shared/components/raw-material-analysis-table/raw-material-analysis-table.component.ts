import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  StatusPanelDef,
} from 'ag-grid-enterprise';

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
  standalone: false,
})
export class RawMaterialAnalysisTableComponent implements OnInit, OnChanges {
  @Input() materialDesignation: string;
  @Input() selectedBomItem: BomItem;
  @Input() selectedCalculation: Calculation;

  @Input() rawMaterialAnalysisData: RawMaterialAnalysis[];
  @Input() rawMaterialAnalysisSummary: RawMaterialAnalysis[];
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

  defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  columnDefs: ColDef[];

  components: any;

  noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => this.errorMessage,
  };

  loadingOverlayComponent = 'customLoadingOverlay';
  noRowsOverlayComponent = 'customNoRowsOverlay';

  getMainMenuItems = getMainMenuItems;
  statusBar: {
    statusPanels: StatusPanelDef[];
  };
  modules: any[];

  private gridApi: GridApi;

  constructor(
    private readonly columnDefinitionService: ColumnDefinitionService,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.columnDefs = this.columnDefinitionService.getColDef();
    this.statusBar = STATUS_BAR_CONFIG;
    this.components = FRAMEWORK_COMPONENTS;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.gridApi) {
      return;
    }

    if (changes.isLoading?.currentValue) {
      /**
       * timeout is necessary, so that the table can meanwhile check, if there is data to display or not
       * the table only shows overlays, if there is no data to display
       */
      setTimeout(() => this.gridApi.setGridOption('loading', true), 10);
    } else if (changes.rawMaterialAnalysisData?.currentValue?.length === 0) {
      this.showNoDataOverlay();
    } else {
      this.errorMessage = '';
      this.gridApi.setGridOption('loading', false);
    }
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    if (!this.isLoading && this.rawMaterialAnalysisData.length === 0) {
      this.gridApi.showNoRowsOverlay();
    }
  }

  private showNoDataOverlay(): void {
    this.errorMessage = this.translocoService.translate(
      `shared.noDataToDisplay`
    );
    this.gridApi.showNoRowsOverlay();
  }
}
