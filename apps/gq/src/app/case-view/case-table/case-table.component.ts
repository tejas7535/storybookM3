import { Component, Input } from '@angular/core';

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
export class CaseTableComponent {
  constructor(private readonly columnDefService: ColumnDefService) {}

  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = this.columnDefService.COLUMN_DEFS;
  public statusBar = STATUS_BAR_CONFIG;
  public frameworkComponents = FRAMEWORK_COMPONENTS;
  public rowSelection = 'multiple';

  @Input() rowData: ViewQuotation[];
}
