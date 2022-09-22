import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { combineLatest, map, Observable, of } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  ColDef,
  ColumnState,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-community';

import { userHasGPCRole } from '../../../core/store';
import { ComparableLinkedTransaction } from '../../../core/store/reducers/transactions/models/comparable-linked-transaction.model';
import { TableContext } from '../../../process-case-view/quotation-details-table/config/tablecontext.model';
import { AgGridLocale } from '../../../shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '../../../shared/ag-grid/services/localization.service';
import { basicTableStyle } from '../../../shared/constants';
import { Quotation } from '../../../shared/models';
import { AgGridStateService } from '../../../shared/services/ag-grid-state.service/ag-grid-state.service';
import { DEFAULT_COLUMN_DEFS } from './config';
import { ColumnDefService } from './config/column-def.service';
import { COMPONENTS } from './config/components';

@Component({
  selector: 'gq-comparable-transactions',
  templateUrl: './comparable-transactions.component.html',
  styles: [basicTableStyle],
})
export class ComparableTransactionsComponent implements OnInit {
  @Input() rowData: ComparableLinkedTransaction[];
  @Input() set currency(currency: string) {
    this.tableContext.quotation.currency = currency;
  }

  @Output() filterChanged: EventEmitter<FilterChangedEvent> =
    new EventEmitter<FilterChangedEvent>();

  private readonly TABLE_KEY = 'transactions';
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public localeText$: Observable<AgGridLocale>;
  columnDefs$: Observable<ColDef[]>;

  tableContext: TableContext = {
    quotation: { customer: {} } as unknown as Quotation,
  };

  components = COMPONENTS;

  constructor(
    private readonly columnDefService: ColumnDefService,
    private readonly agGridStateService: AgGridStateService,
    private readonly localizationService: LocalizationService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
    this.columnDefs$ = combineLatest([
      of(this.columnDefService.COLUMN_DEFS),
      this.store.pipe(userHasGPCRole),
    ]).pipe(
      map(([colDefs, hasGPCRole]: [ColDef[], boolean]) =>
        hasGPCRole
          ? colDefs
          : colDefs.filter((colDef) => colDef.field !== 'profitMargin')
      )
    );
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
