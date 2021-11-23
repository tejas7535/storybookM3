import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ColDef,
  ColumnApi,
  ExcelStyle,
  FirstDataRenderedEvent,
  GridReadyEvent,
  SortChangedEvent,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { getColumnDefsForRoles } from '../../core/store';
import { basicTableStyle, statusBarStlye } from '../../shared/constants';
import { excelStyles } from '../../shared/custom-status-bar/export-to-excel-button/excel-styles.constants';
import { Quotation } from '../../shared/models';
import { QuotationDetail } from '../../shared/models/quotation-detail';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service/ag-grid-state.service';
import { ColumnDefService } from '../../shared/services/column-utility-service/column-def.service';
import {
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';
import { TableContext } from './config/tablecontext.model';

@Component({
  selector: 'gq-quotation-details-table',
  templateUrl: './quotation-details-table.component.html',
  styles: [basicTableStyle, statusBarStlye],
})
export class QuotationDetailsTableComponent implements OnInit {
  private readonly TABLE_KEY = 'processCase';

  rowData: QuotationDetail[];
  sideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: translate<string>(
          'shared.quotationDetailsTable.sidebar.columns'
        ),
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressPivotMode: true,
          suppressRowGroups: true,
          suppressValues: true,
        },
      },
      {
        id: 'filters',
        labelDefault: translate<string>(
          'shared.quotationDetailsTable.sidebar.filters'
        ),
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
    ],
  };

  tableContext: TableContext = {
    quotation: undefined,
  };

  @Input() set quotation(quotation: Quotation) {
    this.rowData = quotation?.quotationDetails;
    this.tableContext.quotation = quotation;
  }

  modules: any[] = MODULES;

  public defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;

  public statusBar: { statusPanels: StatusPanelDef[] } = STATUS_BAR_CONFIG;

  public frameworkComponents = FRAMEWORK_COMPONENTS;

  public columnDefs$: Observable<ColDef[]>;
  public rowSelection = 'multiple';
  public excelStyles: ExcelStyle[] = excelStyles;

  constructor(
    private readonly store: Store,
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefService
  ) {}

  ngOnInit(): void {
    this.columnDefs$ = this.store.select(
      getColumnDefsForRoles(this.columnDefinitionService.COLUMN_DEFS)
    );
  }

  public onColumnChange(event: SortChangedEvent): void {
    this.agGridStateService.setColumnState(
      this.TABLE_KEY,
      event.columnApi.getColumnState()
    );
  }

  public onGridReady(event: GridReadyEvent): void {
    const state = this.agGridStateService.getColumnState(this.TABLE_KEY);
    if (state) {
      event.columnApi.setColumnState(state);
    }
  }

  public onFirstDataRendered(event: FirstDataRenderedEvent): void {
    const gridColumnApi: ColumnApi = event.columnApi;
    gridColumnApi.autoSizeAllColumns(false);
  }
}
