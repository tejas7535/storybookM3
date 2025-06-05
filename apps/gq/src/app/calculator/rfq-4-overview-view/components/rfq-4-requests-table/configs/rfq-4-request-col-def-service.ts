import { inject, Injectable } from '@angular/core';

import { RfqIdComponent } from '@gq/calculator/rfq-4-overview-view/components/rfq-4-requests-table/cell-renderer/rfq-id/rfq-id.component';
import { Rfq4CalculatorStatusCellComponent } from '@gq/shared/ag-grid/cell-renderer/rfq-4-status-cell/rfq-4-calculator-status-cell/rfq-4-calculator-status-cell.component';
import { FILTER_PARAMS } from '@gq/shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { DateFilterParamService } from '@gq/shared/ag-grid/services/date-filter-param/date-filter-param.service';
import { Rfq4IdPipe } from '@gq/shared/pipes/rfq-4-id.pipe';
import { translate } from '@jsverse/transloco';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';

import { Rfq4RequestsFields } from './rfq-4-requests-fields.enum';

@Injectable({
  providedIn: 'root',
})
export class Rfq4RequestsColDefService {
  private readonly columnUtilityService: ColumnUtilityService =
    inject(ColumnUtilityService);
  private readonly dateFilterParamService: DateFilterParamService = inject(
    DateFilterParamService
  );

  COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('calculator.rfq4Overview.rfq4RequestsTable.rfqId'),
      field: Rfq4RequestsFields.RFQ_ID,
      pinned: 'left',
      valueFormatter: this.getRfq4IdValueFormatter,
      cellRenderer: RfqIdComponent,
      filterParams: FILTER_PARAMS,
      width: 175,
    },
    {
      headerName: translate(
        'calculator.rfq4Overview.rfq4RequestsTable.matDesc'
      ),
      field: Rfq4RequestsFields.MAT_DESC,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'calculator.rfq4Overview.rfq4RequestsTable.matNumber'
      ),
      field: Rfq4RequestsFields.MAT_NUMBER,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('calculator.rfq4Overview.rfq4RequestsTable.status'),
      field: Rfq4RequestsFields.STATUS,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          translate('shared.rfq4StatusLabels.rfq4Status', {
            rfq4Status: params.value,
          }),
      },
      valueFormatter: (params: ValueFormatterParams) =>
        translate('shared.rfq4StatusLabels.rfq4Status', {
          rfq4Status: params.value,
        }),
      cellRenderer: Rfq4CalculatorStatusCellComponent,
    },
    {
      headerName: translate(
        'calculator.rfq4Overview.rfq4RequestsTable.createdBy'
      ),
      field: Rfq4RequestsFields.CREATED_BY,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'calculator.rfq4Overview.rfq4RequestsTable.assignedTo'
      ),
      field: Rfq4RequestsFields.ASSIGNED_TO,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'calculator.rfq4Overview.rfq4RequestsTable.customerNumber'
      ),
      field: Rfq4RequestsFields.CUST_NUMBER,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'calculator.rfq4Overview.rfq4RequestsTable.customerName'
      ),
      field: Rfq4RequestsFields.CUST_NAME,
      filterParams: FILTER_PARAMS,
    },

    {
      headerName: translate(
        'calculator.rfq4Overview.rfq4RequestsTable.lastUpdated'
      ),
      field: Rfq4RequestsFields.LAST_UPDATED,
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(data.data.rfqLastUpdated),
      filterParams: this.dateFilterParamService.DATE_FILTER_PARAMS,
      filterValueGetter: (params) =>
        this.columnUtilityService.dateFilteringFormatter(
          params.data?.rfqLastUpdated
        ),
    },
  ];

  getColDefsForOpenTab(): ColDef[] {
    return this.COLUMN_DEFS.filter(
      (colDef: ColDef) => colDef.field !== Rfq4RequestsFields.ASSIGNED_TO
    );
  }
  getColDefsForNonOpenTab(): ColDef[] {
    return this.COLUMN_DEFS.filter(
      (colDef: ColDef) => colDef.field !== Rfq4RequestsFields.STATUS
    );
  }

  getRfq4IdValueFormatter(data: any): string {
    const pipe = new Rfq4IdPipe();

    return pipe.transform(data.value);
  }
}
