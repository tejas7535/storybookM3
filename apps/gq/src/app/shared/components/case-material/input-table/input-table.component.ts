import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { DEFAULT_COLUMN_DEFS } from '@gq/detail-view/transaction-view/comparable-transactions/config/default-column-def';
import { CreateCaseActionCellComponent } from '@gq/shared/ag-grid/cell-renderer/action-cells/create-case-action-cell/create-case-action-cell.component';
import { CreateCaseActionHeaderComponent } from '@gq/shared/ag-grid/cell-renderer/action-cells/create-case-action-header/create-case-action-header.component';
import { ProcessCaseActionCellComponent } from '@gq/shared/ag-grid/cell-renderer/action-cells/process-case-action-cell/process-case-action-cell.component';
import { ProcessCaseActionHeaderComponent } from '@gq/shared/ag-grid/cell-renderer/action-cells/process-case-action-header/process-case-action-header.component';
import { CellRendererModule } from '@gq/shared/ag-grid/cell-renderer/cell-renderer.module';
import { AddMaterialButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { CreateCaseResetAllButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/create-case-reset-all-button/create-case-reset-all-button.component';
import { ProcessCaseResetAllButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { RemoveAllFilteredButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/remove-all-filtered-button/remove-all-filtered-button.component';
import { PasteButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/paste-button/paste-button.component';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, StatusPanelDef } from 'ag-grid-enterprise';

import { AgGridLocale } from '../../../ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '../../../ag-grid/services/localization.service';
import {
  basicTableStyle,
  statusBarStlye,
} from '../../../constants/table-styles';
import { StatusBarConfig } from '../../../models/table/status-bar-config.model';
import { BASE_STATUS_BAR_CONFIG } from './config/base-status-bar';
import { COMPONENTS } from './config/components';
import { InputTableColumnDefService } from './config/input-table-column-defs.service';

@Component({
  selector: 'gq-material-input-table',
  templateUrl: './input-table.component.html',
  styles: [basicTableStyle, statusBarStlye],
  standalone: true,
  imports: [AgGridModule, CommonModule, CellRendererModule, PushPipe],
})
export class InputTableComponent implements OnInit {
  @Input() isCaseView: boolean;
  @Input() rowData: any[];

  defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  columnDefs: ColDef[];
  statusBar: StatusBarConfig;
  components = COMPONENTS;
  localeText$: Observable<AgGridLocale>;
  isNewCaseCreationView = false;

  private readonly featureToggleConfigService = inject(
    FeatureToggleConfigService
  );
  columnDefinitionService = inject(InputTableColumnDefService);
  localizationService = inject(LocalizationService);

  ngOnInit(): void {
    this.isNewCaseCreationView = this.featureToggleConfigService.isEnabled(
      'createManualCaseAsView'
    );
    this.columnDefs = this.initColDef(
      this.isCaseView,
      this.isNewCaseCreationView
        ? this.columnDefinitionService.NEW_CASE_CREATION_COLUMN_DEFS
        : this.columnDefinitionService.BASE_COLUMN_DEFS
    );
    this.statusBar = this.initStatusBar(
      this.isCaseView,
      this.isNewCaseCreationView,
      BASE_STATUS_BAR_CONFIG
    );
    this.localeText$ = this.localizationService.locale$;
  }

  initColDef(isCaseView: boolean, colDef: ColDef[]): ColDef[] {
    const actionCell: ColDef = {
      cellRenderer: isCaseView
        ? CreateCaseActionCellComponent
        : ProcessCaseActionCellComponent,
      flex: this.isNewCaseCreationView ? 0 : 0.2,
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
    isNewCaseCreationView: boolean,
    statusBar: StatusBarConfig
  ): StatusBarConfig {
    const addPanel: StatusPanelDef = {
      statusPanel: isCaseView
        ? CreateCaseButtonComponent
        : AddMaterialButtonComponent,
      align: 'left',
    };
    const resetAllFilteredPanel: StatusPanelDef = {
      statusPanel: RemoveAllFilteredButtonComponent,
      align: 'right',
      statusPanelParams: {
        isCaseView,
      },
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
        isNewCaseCreationView,
      },
    };

    const adjustedStatusBar = {
      statusPanels: [
        ...statusBar.statusPanels,
        ...(isNewCaseCreationView && isCaseView ? [] : [addPanel]),
        pastePanel,
        resetAllFilteredPanel,
        resetPanel,
      ],
    };

    return adjustedStatusBar;
  }
}
