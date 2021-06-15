import { Component, Input, OnInit } from '@angular/core';

import { ColDef } from '@ag-grid-community/core';

import { StatusBarConfig } from '../../models/table';
import { HelperService } from '../../services/helper-service/helper-service.service';
import {
  BASE_COLUMN_DEFS,
  BASE_STATUS_BAR_CONFIG,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
} from './config';

@Component({
  selector: 'gq-material-input-table',
  templateUrl: './input-table.component.html',
  styleUrls: ['./input-table.component.scss'],
})
export class InputTableComponent implements OnInit {
  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs: ColDef[];
  public statusBar: StatusBarConfig;
  public frameworkComponents = FRAMEWORK_COMPONENTS;

  @Input() isCaseView: boolean;
  @Input() rowData: any[];

  ngOnInit(): void {
    this.columnDefs = HelperService.initColDef(
      this.isCaseView,
      BASE_COLUMN_DEFS
    );
    this.statusBar = HelperService.initStatusBar(
      this.isCaseView,
      BASE_STATUS_BAR_CONFIG
    );
  }
}
