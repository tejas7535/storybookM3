import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ColumnState,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridReadyEvent,
  SortChangedEvent,
} from '@ag-grid-community/all-modules';

import { ComparableLinkedTransaction } from '../../../core/store/reducers/transactions/models/comparable-linked-transaction.model';
import { TableContext } from '../../../process-case-view/quotation-details-table/config/tablecontext.model';
import { AgGridLocale } from '../../../shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '../../../shared/ag-grid/services/localization.service';
import { basicTableStyle } from '../../../shared/constants';
import { Quotation } from '../../../shared/models';
import { AgGridStateService } from '../../../shared/services/ag-grid-state.service/ag-grid-state.service';
import { DEFAULT_COLUMN_DEFS, MODULES } from './config';
import { ColumnDefService } from './config/column-def.service';

@Component({
  selector: 'gq-comparable-transactions',
  templateUrl: './comparable-transactions.component.html',
  styles: [basicTableStyle],
})
export class ComparableTransactionsComponent implements OnInit {
  @Input() rowData: ComparableLinkedTransaction[];
  @Input() set currency(currency: string) {
    this.tableContext.quotation.customer.currency = currency;
  }

  @Output() filterChanged: EventEmitter<FilterChangedEvent> =
    new EventEmitter<FilterChangedEvent>();

  private readonly TABLE_KEY = 'transactions';
  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = this.columnDefService.COLUMN_DEFS;
  public localeText$: Observable<AgGridLocale>;

  tableContext: TableContext = {
    quotation: { customer: {} } as unknown as Quotation,
  };

  constructor(
    private readonly columnDefService: ColumnDefService,
    private readonly agGridStateService: AgGridStateService,
    private readonly localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
  }

  public onColumnChange(event: SortChangedEvent): void {
    const columnState: ColumnState[] = event.columnApi.getColumnState();

    this.agGridStateService.setColumnState(this.TABLE_KEY, columnState);
  }

  public onGridReady(event: GridReadyEvent): void {
    const state = this.agGridStateService.getColumnState(this.TABLE_KEY);
    if (state) {
      event.columnApi.setColumnState(state);
    }
  }

  public onFirstDataRendered(event: FirstDataRenderedEvent): void {
    const colIds = event.columnApi.getAllColumns().map((el) => el.getColId());

    colIds.forEach((colId) => {
      event.columnApi.autoSizeColumn(colId, colId === 'customerId');
    });
  }

  onFilterChanged(event: FilterChangedEvent) {
    this.filterChanged.emit(event);
  }
}
