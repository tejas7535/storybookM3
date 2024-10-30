import { Component, OnInit } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';

import { AlertRulesService } from '../../../../../feature/alert-rules/alert-rules.service';
import { AlertRule } from '../../../../../feature/alert-rules/model';
import {
  clientSideTableDefaultProps,
  getDefaultColDef,
  sideBar,
} from '../../../../../shared/ag-grid/grid-defaults';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { alertRuleColumnDefinitions } from '../../column-definition';
import { AlertRulesColumnSettingsService } from '../../services/alert-rules-column-settings.service';
import { AlertRuleTableRowMenuButtonComponent } from '../alert-rule-table-row-menu-button/alert-rule-table-row-menu-button.component';

type AlertRuleColumnDefinitions = ReturnType<
  typeof alertRuleColumnDefinitions
>[number];

@Component({
  selector: 'app-alert-rule-table',
  standalone: true,
  imports: [AgGridModule, AlertRuleTableRowMenuButtonComponent],
  templateUrl: './alert-rule-table.component.html',
  styleUrl: './alert-rule-table.component.scss',
})
export class AlertRuleTableComponent implements OnInit {
  gridApi: GridApi;

  protected gridOptions: GridOptions = {
    ...clientSideTableDefaultProps,
    sideBar,
    // columnDefs: [...alertRuleColumnDefinitions],
  };
  protected rowData: AlertRule[];
  protected columnDefs: ColDef[];

  constructor(
    private readonly columnSettingsService: AlertRulesColumnSettingsService<
      string,
      AlertRuleColumnDefinitions
    >,
    protected readonly agGridLocalizationService: AgGridLocalizationService,
    private readonly alertRulesService: AlertRulesService
  ) {}

  ngOnInit(): void {
    this.createColumnDefs();
    this.getAlertRuleData();
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
  }

  getAlertRuleData() {
    this.alertRulesService.getAlertRuleData().subscribe((data) => {
      this.rowData = data?.content;
      // TODO use grid api when ag-grid is updated to v31
      // this.grid.api.setGridOption('rowData', data?.content);
    });
  }

  createColumnDefs() {
    this.columnSettingsService
      .getColumnSettings()
      .subscribe((columnSettings) => {
        this.columnDefs = [
          ...(columnSettings.map((col) => ({
            ...getDefaultColDef(col.filter, col.filterParams),
            key: col.colId,
            colId: col.colId,
            field: col.colId,
            headerName: translate(col.title, {}),
            filter: col.filter,
            cellRenderer: col.cellRenderer,
            hide: !col.visible,
            sortable: col.sortable,
            sort: col.sort,
            lockVisible: col.alwaysVisible,
            lockPinned: true,
            valueFormatter: col.valueFormatter,
          })) || []),
          {
            field: 'menu',
            headerName: '',
            cellRenderer: AlertRuleTableRowMenuButtonComponent,
            lockVisible: true,
            pinned: 'right',
            lockPinned: true,
            // cellRendererParams: {
            //   onPerformAction: () => {
            //     alertRuleData.refresh();
            //   },
            //   onDeleteAction: (data: AlertRule) => {
            //     setSelectedAlertRuleForEdit({ ...data });
            //     setOpenModal(AlertModal.DELETE_SINGLE);
            //   },
            //   onEditAction: (data: AlertRule) => {
            //     // data comes form ag grid, we create a new object instance to prevent errors when working on the internal ag grid data structure
            //     setSelectedAlertRuleForEdit({ ...data });
            //     setAlertRuleModalTitle('edit');
            //     setOpenModal(AlertModal.EDIT_SINGLE);
            //   },
            // },
            suppressMenu: true,
            maxWidth: 64,
            // TODO cellstyle remove margin-right 16px --> Check where this come from...
            suppressSizeToFit: true,
          },
        ] as ColDef[];
        // TODO use grid api when ag-grid is updated to v31
        // this.grid.api.setGridOption('columnDefs', columnDefs);
      });
  }
}
