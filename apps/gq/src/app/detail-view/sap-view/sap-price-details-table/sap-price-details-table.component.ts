import { Component, inject, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { SapPriceConditionDetail } from '@gq/core/store/reducers/models';
import { BaseAgGridComponent } from '@gq/detail-view/base-ag-grid.component';
import { TableContext } from '@gq/process-case-view/quotation-details-table/config/tablecontext.model';
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

@Component({
  selector: 'gq-sap-price-details-table',
  templateUrl: './sap-price-details-table.component.html',
  styles: [basicTableStyle, disableTableHorizontalScrollbar],
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

  ngOnInit(): void {
    super.ngOnInit();
  }
}
