import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ColDef,
  ColumnApi,
  ColumnEvent,
  ColumnState,
  GridReadyEvent,
  IStatusPanelParams,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { Quotation } from '../../shared/models';
import { QuotationDetail } from '../../shared/models/quotation-detail';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service/ag-grid-state.service';
import { ColumnDefService } from '../../shared/services/column-utility-service/column-def.service';
import { ColumnUtilityService } from '../../shared/services/column-utility-service/column-utility.service';
import {
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'gq-quotation-details-table',
  templateUrl: './quotation-details-table.component.html',
  styleUrls: ['./quotation-details-table.component.scss'],
})
export class QuotationDetailsTableComponent implements OnInit {
  private readonly TABLE_KEY = 'processCase';

  rowData: QuotationDetail[];

  tableContext: any = {
    currency: undefined,
  };

  @Input() set quotation(quotation: Quotation) {
    this.rowData = quotation?.quotationDetails;
    this.tableContext.currency = quotation?.currency;
  }

  modules: any[] = MODULES;

  public defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;

  public statusBar: { statusPanels: StatusPanelDef[] } = STATUS_BAR_CONFIG;

  public frameworkComponents = FRAMEWORK_COMPONENTS;

  public columnDefs$: Observable<ColDef[]>;
  public rowSelection = 'multiple';

  constructor(
    private readonly store: Store,
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefService
  ) {}

  ngOnInit(): void {
    this.columnDefs$ = this.store
      .select(getRoles)
      .pipe(
        map((roles) =>
          ColumnUtilityService.createColumnDefs(
            roles,
            this.columnDefinitionService.COLUMN_DEFS
          )
        )
      );
  }

  public onColumnChange(event: ColumnEvent): void {
    const columnState: ColumnState[] = event.columnApi.getColumnState();

    this.agGridStateService.setColumnState(this.TABLE_KEY, columnState);
  }

  public onGridReady(event: GridReadyEvent): void {
    const state = this.agGridStateService.getColumnState(this.TABLE_KEY);
    if (state) {
      event.columnApi.setColumnState(state);
    }
  }

  public onFirstDataRendered(params: IStatusPanelParams): void {
    const gridColumnApi: ColumnApi = params.columnApi;
    gridColumnApi.autoSizeAllColumns(false);
  }
}
