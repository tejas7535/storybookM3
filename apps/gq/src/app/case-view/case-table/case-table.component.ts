import { Component } from '@angular/core';

import {
  COLUMN_DEFS,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'gq-case-table',
  templateUrl: './case-table.component.html',
  styleUrls: ['./case-table.component.scss'],
})
export class CaseTableComponent {
  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = COLUMN_DEFS;
  public statusBar = STATUS_BAR_CONFIG;
  public frameworkComponents = FRAMEWORK_COMPONENTS;

  rowData: any = [];
}
