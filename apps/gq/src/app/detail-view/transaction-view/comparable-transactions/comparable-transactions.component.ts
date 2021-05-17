import { Component, Input } from '@angular/core';

import {
  ColumnEvent,
  ColumnState,
  GridReadyEvent,
  IStatusPanelParams,
} from '@ag-grid-community/all-modules';

import { Transaction } from '../../../core/store/reducers/transactions/models/transaction.model';
import { AgGridStateService } from '../../../shared/services/ag-grid-state.service/ag-grid-state.service';
import { DEFAULT_COLUMN_DEFS, MODULES } from './config';
import { ColumnDefService } from './config/column-def.service';

@Component({
  selector: 'gq-comparable-transactions',
  templateUrl: './comparable-transactions.component.html',
  styleUrls: ['./comparable-transactions.component.scss'],
})
export class ComparableTransactionsComponent {
  @Input() rowData: Transaction[];
  @Input() set currency(currency: string) {
    this.tableContext.currency = currency;
  }

  private readonly TABLE_KEY = 'transactions';
  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = this.columnDefService.COLUMN_DEFS;

  tableContext: { currency: string } = {
    currency: undefined,
  };

  constructor(
    private readonly columnDefService: ColumnDefService,
    private readonly agGridStateService: AgGridStateService
  ) {}

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
    const colIds = params.columnApi.getAllColumns().map((el) => el.getColId());

    colIds.forEach((colId) => {
      params.columnApi.autoSizeColumn(colId, colId === 'customerId');
    });
  }
}
