import { Component, Input, OnChanges } from '@angular/core';

import {
  ColDef,
  GridApi,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';

import { QuotationDetail } from '../../core/store/models';
import {
  COLUMN_DEFS_FINISH_OFFER,
  COLUMN_DEFS_SHORT,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  FRAMEWORK_COMPONENTS_FINISH_OFFER,
  MODULES,
  STATUS_BAR_CONFIG,
  STATUS_BAR_CONFIG_FINISH_OFFER,
} from './config';

@Component({
  selector: 'gq-offer-table',
  templateUrl: './offer-table.component.html',
  styleUrls: ['./offer-table.component.scss'],
})
export class OfferTableComponent implements OnChanges {
  @Input() rowData: QuotationDetail[];

  @Input() drawerTable = false;

  modules: any[] = MODULES;

  public defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG_FINISH_OFFER;

  public frameworkComponents: any = FRAMEWORK_COMPONENTS_FINISH_OFFER;

  public columnDefs: ColDef[] = COLUMN_DEFS_FINISH_OFFER;

  public rowSelection = 'multiple';
  public components: any[] = [];

  onFirstDataRendered(params: any): void {
    params.api.sizeColumnsToFit();
  }

  ngOnChanges(): void {
    this.columnDefs = this.drawerTable
      ? COLUMN_DEFS_SHORT
      : COLUMN_DEFS_FINISH_OFFER;
    this.frameworkComponents = this.drawerTable
      ? FRAMEWORK_COMPONENTS
      : FRAMEWORK_COMPONENTS_FINISH_OFFER;
    this.statusBar = this.drawerTable
      ? STATUS_BAR_CONFIG
      : STATUS_BAR_CONFIG_FINISH_OFFER;
  }

  onGridReady(params: any): void {
    const gridApi: GridApi = params.api;
    gridApi.sizeColumnsToFit();
  }
}
