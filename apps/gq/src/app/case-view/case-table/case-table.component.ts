import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AgGridLocale } from '../../shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '../../shared/ag-grid/services/localization.service';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
  statusBarStlye,
} from '../../shared/constants';
import { ViewQuotation } from '../models/view-quotation.model';
import {
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';
import { ColumnDefService } from './config/column-def.service';
@Component({
  selector: 'gq-case-table',
  templateUrl: './case-table.component.html',
  styles: [basicTableStyle, disableTableHorizontalScrollbar, statusBarStlye],
})
export class CaseTableComponent implements OnInit {
  constructor(
    private readonly columnDefService: ColumnDefService,
    private readonly localizationService: LocalizationService
  ) {}

  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = this.columnDefService.COLUMN_DEFS;
  public statusBar = STATUS_BAR_CONFIG;
  public frameworkComponents = FRAMEWORK_COMPONENTS;
  public rowSelection = 'multiple';
  public localeText$: Observable<AgGridLocale>;

  @Input() rowData: ViewQuotation[];

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
  }
}
