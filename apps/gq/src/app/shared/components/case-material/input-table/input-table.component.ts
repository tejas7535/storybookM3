import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ColDef } from 'ag-grid-enterprise';

import { AgGridLocale } from '../../../ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '../../../ag-grid/services/localization.service';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
  statusBarStlye,
} from '../../../constants/table-styles';
import { StatusBarConfig } from '../../../models/table';
import { HelperService } from '../../../services/helper/helper.service';
import {
  BASE_STATUS_BAR_CONFIG,
  COMPONENTS,
  DEFAULT_COLUMN_DEFS,
  InputTableColumnDefService,
} from './config';

@Component({
  selector: 'gq-material-input-table',
  templateUrl: './input-table.component.html',
  styles: [basicTableStyle, statusBarStlye, disableTableHorizontalScrollbar],
})
export class InputTableComponent implements OnInit {
  constructor(
    private readonly columnDefinitionService: InputTableColumnDefService,
    private readonly localizationService: LocalizationService
  ) {}
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs: ColDef[];
  public statusBar: StatusBarConfig;
  public components = COMPONENTS;
  public localeText$: Observable<AgGridLocale>;

  @Input() isCaseView: boolean;
  @Input() rowData: any[];

  ngOnInit(): void {
    this.columnDefs = HelperService.initColDef(
      this.isCaseView,
      this.columnDefinitionService.BASE_COLUMN_DEFS
    );
    this.statusBar = HelperService.initStatusBar(
      this.isCaseView,
      BASE_STATUS_BAR_CONFIG
    );
    this.localeText$ = this.localizationService.locale$;
  }
}
