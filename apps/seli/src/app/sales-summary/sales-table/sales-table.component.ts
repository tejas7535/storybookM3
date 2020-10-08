import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ClientSideRowModelModule,
  ColDef,
  Module,
} from '@ag-grid-community/all-modules';
import { select, Store } from '@ngrx/store';

import { getInitialData } from '../../core/store/actions/sales-summary-data/sales-summary-data.actions';
import { SalesSummaryData } from '../../core/store/reducers/sales-summary-data/models/sales-summary-data-model';
import { SalesSummaryDataState } from '../../core/store/reducers/sales-summary-data/sales-summary-data.reducer';
import { getItems } from '../../core/store/selectors';
import { COLUMN_DEFINITIONS } from './config/column-definitions';
import { DEFAULT_COLUMN_DEFINITION } from './config/default-column-definitions';

@Component({
  selector: 'seli-sales.-table',
  templateUrl: './sales-table.component.html',
  styleUrls: ['./sales-table.component.scss'],
})
export class SalesTableComponent implements OnInit {
  items$: Observable<SalesSummaryData[]>;

  public constructor(private readonly store: Store<SalesSummaryDataState>) {}

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = COLUMN_DEFINITIONS;
  public modules: Module[] = [ClientSideRowModelModule];

  ngOnInit(): void {
    getInitialData();
    this.items$ = this.store.pipe(select(getItems));
  }
}
