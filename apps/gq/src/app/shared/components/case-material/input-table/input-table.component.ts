import { Component, inject, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  CreateCaseActionCellComponent,
  CreateCaseActionHeaderComponent,
  ProcessCaseActionCellComponent,
  ProcessCaseActionHeaderComponent,
} from '@gq/shared/ag-grid/cell-renderer';
import { AddMaterialButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { CreateCaseResetAllButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/create-case-reset-all-button/create-case-reset-all-button.component';
import { ProcessCaseResetAllButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { PasteButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/paste-button/paste-button.component';
import { ColDef, StatusPanelDef } from 'ag-grid-enterprise';

import { AgGridLocale } from '../../../ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '../../../ag-grid/services/localization.service';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
  statusBarStlye,
} from '../../../constants/table-styles';
import { StatusBarConfig } from '../../../models/table';
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
  @Input() isCaseView: boolean;
  @Input() rowData: any[];

  defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  columnDefs: ColDef[];
  statusBar: StatusBarConfig;
  components = COMPONENTS;
  localeText$: Observable<AgGridLocale>;

  columnDefinitionService = inject(InputTableColumnDefService);
  localizationService = inject(LocalizationService);

  ngOnInit(): void {
    this.columnDefs = this.initColDef(
      this.isCaseView,
      this.columnDefinitionService.BASE_COLUMN_DEFS
    );
    this.statusBar = this.initStatusBar(
      this.isCaseView,
      BASE_STATUS_BAR_CONFIG
    );
    this.localeText$ = this.localizationService.locale$;
  }

  initColDef(isCaseView: boolean, colDef: ColDef[]): ColDef[] {
    const actionCell: ColDef = {
      cellRenderer: isCaseView
        ? CreateCaseActionCellComponent
        : ProcessCaseActionCellComponent,
      flex: 0.2,
      filter: false,
      floatingFilter: false,
      headerComponent: isCaseView
        ? CreateCaseActionHeaderComponent
        : ProcessCaseActionHeaderComponent,
    };

    return [...colDef, actionCell];
  }

  initStatusBar(
    isCaseView: boolean,
    statusBar: StatusBarConfig
  ): StatusBarConfig {
    const addPanel: StatusPanelDef = {
      statusPanel: isCaseView
        ? CreateCaseButtonComponent
        : AddMaterialButtonComponent,
      align: 'left',
    };
    const resetPanel: StatusPanelDef = {
      statusPanel: isCaseView
        ? CreateCaseResetAllButtonComponent
        : ProcessCaseResetAllButtonComponent,
      align: 'right',
    };
    const pastePanel: StatusPanelDef = {
      statusPanel: PasteButtonComponent,
      align: 'left',
      statusPanelParams: {
        isCaseView,
      },
    };

    const adjustedStatusBar = {
      statusPanels: [
        ...statusBar.statusPanels,
        addPanel,
        pastePanel,
        resetPanel,
      ],
    };

    return adjustedStatusBar;
  }
}
