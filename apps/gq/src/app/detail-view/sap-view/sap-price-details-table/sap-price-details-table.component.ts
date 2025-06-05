import { Component, inject, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { SapPriceConditionDetail } from '@gq/core/store/reducers/models';
import { TableContext } from '@gq/process-case-view/quotation-details-table/config/tablecontext.model';
import { BaseAgGridComponent } from '@gq/shared/ag-grid/base-component/base-ag-grid.component';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
} from '@gq/shared/constants/table-styles';

import {
  COMPONENTS,
  SAP_PRICE_DETAILS_DEFAULT_COLUMN_DEFS,
  SapPriceDetailsColumnDefService,
} from './config';
import { ROW_SELECTION } from './config/row-selection.config';

@Component({
  selector: 'gq-sap-price-details-table',
  templateUrl: './sap-price-details-table.component.html',
  styles: [basicTableStyle, disableTableHorizontalScrollbar],
  standalone: false,
})
export class SapPriceDetailsTableComponent
  extends BaseAgGridComponent
  implements OnInit
{
  @Input() rowData: SapPriceConditionDetail[];
  @Input() tableContext: TableContext;

  private readonly columnDefService: SapPriceDetailsColumnDefService = inject(
    SapPriceDetailsColumnDefService
  );

  public components = COMPONENTS;

  protected readonly TABLE_KEY = 'sap-price-details';
  public rowData$: Observable<SapPriceConditionDetail[]>;
  public defaultColumnDefs = SAP_PRICE_DETAILS_DEFAULT_COLUMN_DEFS;
  public columnDefs = this.columnDefService.COLUMN_DEFS;
  public localeText$: Observable<AgGridLocale>;
  rowSelection = ROW_SELECTION;

  ngOnInit(): void {
    super.ngOnInit();
  }
}
