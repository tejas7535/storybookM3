import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  AgGridEvent,
  ColDef,
  ColumnApi,
  ExcelStyle,
  FirstDataRenderedEvent,
  GridReadyEvent,
  RowNode,
  SortChangedEvent,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { getColumnDefsForRoles } from '../../core/store';
import { AgGridLocale } from '../../shared/ag-grid/models/ag-grid-locale.interface';
import { ColumnDefService } from '../../shared/ag-grid/services/column-def.service';
import { LocalizationService } from '../../shared/ag-grid/services/localization.service';
import { basicTableStyle, statusBarStlye } from '../../shared/constants';
import { excelStyles } from '../../shared/custom-status-bar/export-to-excel-button/excel-styles.constants';
import { Quotation } from '../../shared/models';
import { QuotationDetail } from '../../shared/models/quotation-detail';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service/ag-grid-state.service';
import {
  COMPONENTS,
  DEFAULT_COLUMN_DEFS,
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
        labelDefault: translate('shared.quotationDetailsTable.sidebar.columns'),
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
        labelDefault: translate('shared.quotationDetailsTable.sidebar.filters'),
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

  public components = COMPONENTS;

  public columnDefs$: Observable<ColDef[]>;
  public rowSelection = 'multiple';
  public excelStyles: ExcelStyle[] = excelStyles;
  public localeText$: Observable<AgGridLocale>;

  constructor(
    private readonly store: Store,
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefService,
    private readonly localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.columnDefs$ = this.store.select(
      getColumnDefsForRoles(this.columnDefinitionService.COLUMN_DEFS)
    );
    this.localeText$ = this.localizationService.locale$;
  }

  public onColumnChange(event: SortChangedEvent): void {
    this.updateColumnData(event);

    this.agGridStateService.setColumnState(
      this.TABLE_KEY,
      event.columnApi.getColumnState()
    );
  }

  public updateColumnData(event: AgGridEvent): void {
    const columnData = this.buildColumnData(event);

    this.agGridStateService.setColumnData(
      this.tableContext.quotation.gqId.toString(),
      columnData
    );
  }

  public onGridReady(event: GridReadyEvent): void {
    const quotationId = this.tableContext.quotation.gqId.toString();
    if (!this.agGridStateService.getColumnData(quotationId)) {
      const columnData = this.buildColumnData(event);
      this.agGridStateService.setColumnData(quotationId, columnData);
    }

    const state = this.agGridStateService.getColumnState(this.TABLE_KEY);
    if (state) {
      event.columnApi.setColumnState(state);
    }
  }

  private readonly buildColumnData = (event: AgGridEvent) => {
    const columnData: QuotationDetail[] = [];
    event.api.forEachNodeAfterFilterAndSort((node: RowNode) => {
      columnData.push(node.data);
    });

    return columnData;
  };

  public onFirstDataRendered(event: FirstDataRenderedEvent): void {
    const gridColumnApi: ColumnApi = event.columnApi;
    gridColumnApi.autoSizeAllColumns(false);
  }
}
