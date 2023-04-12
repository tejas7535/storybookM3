import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { SapPriceConditionDetail } from '@gq/core/store/reducers/models';
import {
  ColumnState,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-community';

import { TableContext } from '../../../process-case-view/quotation-details-table/config/tablecontext.model';
import { AgGridLocale } from '../../../shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '../../../shared/ag-grid/services/localization.service';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
} from '../../../shared/constants/table-styles';
import { AgGridStateService } from '../../../shared/services/ag-grid-state/ag-grid-state.service';
import {
  COMPONENTS,
  SAP_PRICE_DETAILS_DEFAULT_COLUMN_DEFS,
  SapPriceDetailsColumnDefService,
} from './config';

@Component({
  selector: 'gq-sap-price-details-table',
  templateUrl: './sap-price-details-table.component.html',
  styles: [basicTableStyle, disableTableHorizontalScrollbar],
})
export class SapPriceDetailsTableComponent implements OnInit {
  constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefService: SapPriceDetailsColumnDefService,
    private readonly localizationService: LocalizationService
  ) {}

  @Input() rowData: SapPriceConditionDetail[];
  @Input() tableContext: TableContext;

  public components = COMPONENTS;

  private readonly TABLE_KEY = 'sap-price-details';
  public rowData$: Observable<SapPriceConditionDetail[]>;
  public defaultColumnDefs = SAP_PRICE_DETAILS_DEFAULT_COLUMN_DEFS;
  public columnDefs = this.columnDefService.COLUMN_DEFS;
  public localeText$: Observable<AgGridLocale>;

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
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
}
