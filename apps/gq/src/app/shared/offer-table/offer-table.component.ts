import { Component, Input, OnChanges } from '@angular/core';

import {
  ColDef,
  GridApi,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';

import { QuotationDetail } from '../../core/store/models';
import {
  COLUMN_DEFS_LONG,
  COLUMN_DEFS_SHORT,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'gq-offer-table',
  templateUrl: './offer-table.component.html',
  styleUrls: ['./offer-table.component.scss'],
})
export class OfferTableComponent implements OnChanges {
  @Input() rowData: QuotationDetail[];

  @Input() shortTable = false;

  modules: any[] = MODULES;

  public defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;

  public statusBar: { statusPanels: StatusPanelDef[] } = STATUS_BAR_CONFIG;

  public frameworkComponents = FRAMEWORK_COMPONENTS;

  public columnDefs: ColDef[] = COLUMN_DEFS_LONG;

  public rowSelection = 'multiple';
  public components: any[] = [];

  onFirstDataRendered(params: any): void {
    params.api.sizeColumnsToFit();
  }

  ngOnChanges(): void {
    this.columnDefs = this.shortTable ? COLUMN_DEFS_SHORT : COLUMN_DEFS_LONG;
  }

  onGridReady(params: any): void {
    const gridApi: GridApi = params.api;
    gridApi.sizeColumnsToFit();
  }
}
