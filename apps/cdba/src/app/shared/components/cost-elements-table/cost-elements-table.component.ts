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
} from '@ag-grid-enterprise/all-modules';
import { CostComponentSplit } from '@cdba/shared/models';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import { getMainMenuItems } from '../table';
import { NoRowsParams } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import {
  ColumnDefinitionService,
  DEFAULT_COLUMN_DEFINITION,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'cdba-cost-elements-table',
  templateUrl: './cost-elements-table.component.html',
})
export class CostElementsTableComponent implements OnInit, OnChanges {
  public odataFeatureEnabled: boolean;

  @Input() costElementsData: CostComponentSplit[];
  @Input() costElementsSummary: CostComponentSplit[];
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

  @Input() index: number;

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
    private readonly columnDefinitionService: ColumnDefinitionService,
    private readonly betaFeatureService: BetaFeatureService
  ) {}

  ngOnInit(): void {
    this.odataFeatureEnabled = this.betaFeatureService.getBetaFeature('oData');

    this.columnDefs = this.columnDefinitionService.getColDef();
    this.statusBar = STATUS_BAR_CONFIG;
    this.components = FRAMEWORK_COMPONENTS;

    this.modules = MODULES;
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
