import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ColumnState,
  GridReadyEvent,
  SortChangedEvent,
} from '@ag-grid-community/all-modules';

import { SapPriceDetail } from '../../../core/store/reducers/sap-price-details/models/sap-price-detail.model';
import { TableContext } from '../../../process-case-view/quotation-details-table/config/tablecontext.model';
import { AgGridStateService } from '../../../shared/services/ag-grid-state.service/ag-grid-state.service';
import {
  SAP_PRICE_DETAILS_DEFAULT_COLUMN_DEFS,
  SAP_PRICE_DETAILS_MODULE,
  SapPriceDetailsColumnDefService,
  style,
} from './config';

@Component({
  selector: 'gq-sap-price-details-table',
  templateUrl: './sap-price-details-table.component.html',
  styles: [style],
})
export class SapPriceDetailsTableComponent {
  constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefService: SapPriceDetailsColumnDefService
  ) {}

  @Input() rowData: SapPriceDetail[];
  @Input() tableContext: TableContext;

  private readonly TABLE_KEY = 'sap-price-details';
  public rowData$: Observable<SapPriceDetail[]>;
  public defaultColumnDefs = SAP_PRICE_DETAILS_DEFAULT_COLUMN_DEFS;
  public columnDefs = this.columnDefService.COLUMN_DEFS;
  public modules = SAP_PRICE_DETAILS_MODULE;

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
