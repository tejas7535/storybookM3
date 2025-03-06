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
  standalone: false,
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
    private readonly translocoService: TranslocoService
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
      setTimeout(() => this.gridApi.setGridOption('loading', true), 10);
    } else {
      if (changes.costElementsData?.currentValue.length === 0) {
        this.showNoDataOverlay();
      } else {
        this.errorMessage = '';
        this.gridApi.setGridOption('loading', false);
      }
    }
  }

  public onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    if (!this.isLoading && this.costElementsData.length === 0) {
      this.showNoDataOverlay();
    }
  }

  private showNoDataOverlay(): void {
    this.errorMessage = this.translocoService.translate(
      `shared.table.noDataToDisplay`
    );
    this.gridApi.showNoRowsOverlay();
  }
}
