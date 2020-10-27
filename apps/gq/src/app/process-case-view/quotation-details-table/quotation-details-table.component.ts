import { Component, Input } from '@angular/core';

import { ColDef, StatusPanelDef } from '@ag-grid-community/all-modules';

import { QuotationDetail } from '../../core/store/models';
import {
  COLUMN_DEFS,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'gq-result-table',
  templateUrl: './quotation-details-table.component.html',
  styleUrls: ['./quotation-details-table.component.scss'],
})
export class QuotationDetailsTableComponent {
  @Input() rowData: QuotationDetail[];

  modules: any[] = MODULES;

  public defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;

  public statusBar: { statusPanels: StatusPanelDef[] } = STATUS_BAR_CONFIG;

  public frameworkComponents = FRAMEWORK_COMPONENTS;

  public columnDefs: ColDef[] = COLUMN_DEFS;

  public rowSelection = 'multiple';
  public components: any[] = [];

  onFirstDataRendered(params: any): void {
    params.api.sizeColumnsToFit();
  }
}
