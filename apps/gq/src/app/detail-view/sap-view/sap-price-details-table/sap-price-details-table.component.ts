import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ColumnState,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-community';

import { SapPriceConditionDetail } from '../../../core/store/reducers/sap-price-details/models/sap-price-condition-detail.model';
import { TableContext } from '../../../process-case-view/quotation-details-table/config/tablecontext.model';
import { AgGridLocale } from '../../../shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '../../../shared/ag-grid/services/localization.service';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
} from '../../../shared/constants/table-styles';
import { AgGridStateService } from '../../../shared/services/ag-grid-state.service/ag-grid-state.service';
import {
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

  private readonly TABLE_KEY = 'sap-price-details';
  public rowData$: Observable<SapPriceConditionDetail[]>;
  public defaultColumnDefs = SAP_PRICE_DETAILS_DEFAULT_COLUMN_DEFS;
  public columnDefs = this.columnDefService.COLUMN_DEFS;
  public localeText$: Observable<AgGridLocale>;

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
}
