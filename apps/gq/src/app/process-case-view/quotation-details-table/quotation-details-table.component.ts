import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ColDef,
  ColumnApi,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';
import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/auth';

import { AppState } from '../../core/store';
import { QuotationDetail } from '../../core/store/models';
import { ColumnUtilityService } from '../../shared/services/createColumnService/column-utility.service';
import {
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'gq-result-table',
  templateUrl: './quotation-details-table.component.html',
  styleUrls: ['./quotation-details-table.component.scss'],
})
export class QuotationDetailsTableComponent implements OnInit {
  @Input() rowData: QuotationDetail[];

  modules: any[] = MODULES;

  public defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;

  public statusBar: { statusPanels: StatusPanelDef[] } = STATUS_BAR_CONFIG;

  public frameworkComponents = FRAMEWORK_COMPONENTS;

  public columnDefs$: Observable<ColDef[]>;
  public rowSelection = 'multiple';
  public components: any[] = [];

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.columnDefs$ = this.store.pipe(
      select(getRoles),
      map((roles) => ColumnUtilityService.createColumnDefs(roles, true))
    );
  }

  onFirstDataRendered(params: any): void {
    const gridColumnApi: ColumnApi = params.columnApi;
    gridColumnApi.autoSizeAllColumns(false);
  }
}
