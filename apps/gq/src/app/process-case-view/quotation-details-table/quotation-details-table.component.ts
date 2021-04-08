import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ColDef,
  ColumnApi,
  IStatusPanelParams,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';
import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { AppState } from '../../core/store';
import { Quotation, QuotationDetail } from '../../core/store/models';
import { COLUMN_DEFS } from '../../shared/services/column-utility-service/column-defs';
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

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.columnDefs$ = this.store.pipe(
      select(getRoles),
      map((roles) =>
        ColumnUtilityService.createColumnDefs(roles, true, COLUMN_DEFS)
      )
    );
  }

  onFirstDataRendered(params: IStatusPanelParams): void {
    const gridColumnApi: ColumnApi = params.columnApi;
    gridColumnApi.autoSizeAllColumns(false);
  }
}
