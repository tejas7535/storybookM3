import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { combineLatest, map, Observable, of } from 'rxjs';

import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import { userHasGPCRole } from '@gq/core/store/selectors';
import { TableContext } from '@gq/process-case-view/quotation-details-table/config/tablecontext.model';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '@gq/shared/ag-grid/services/localization.service';
import { basicTableStyle } from '@gq/shared/constants';
import { Quotation } from '@gq/shared/models';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { Store } from '@ngrx/store';
import {
  ColDef,
  ColumnState,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-community';

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
  @Output() filterChanged: EventEmitter<FilterChangedEvent> =
    new EventEmitter<FilterChangedEvent>();
  defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  localeText$: Observable<AgGridLocale>;
  columnDefs$: Observable<ColDef[]>;

  tableContext: TableContext = {
    quotation: { customer: {} } as unknown as Quotation,
  };

  components = COMPONENTS;

  private readonly TABLE_KEY = 'transactions';
  constructor(
    private readonly columnDefService: ColumnDefService,
    private readonly agGridStateService: AgGridStateService,
    private readonly localizationService: LocalizationService,
    private readonly store: Store
  ) {}

  @Input() set currency(currency: string) {
    this.tableContext.quotation.currency = currency;
  }

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

    this.agGridStateService.init(this.TABLE_KEY);
    this.agGridStateService.setActiveView(0);
  }

  public onColumnChange(event: SortChangedEvent): void {
    const columnState: ColumnState[] = event.columnApi.getColumnState();

    this.agGridStateService.setColumnStateForCurrentView(columnState);
  }

  public onGridReady(event: GridReadyEvent): void {
    const state = this.agGridStateService.getColumnStateForCurrentView();
    if (state) {
      event.columnApi.applyColumnState({ state, applyOrder: true });
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
