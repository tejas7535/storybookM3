import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-enterprise';

import { FILTER_PARAMS } from '../../../shared/ag-grid/constants/filters';
import { CustomDateFilterComponent } from '../../../shared/ag-grid/custom-date-filter/custom-date-filter.component';
import { CustomDateFloatingFilterComponent } from '../../../shared/ag-grid/custom-date-floating-filter/custom-date-floating-filter.component';
import { ColumnUtilityService } from '../../../shared/ag-grid/services/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  constructor(private readonly columnUtilityService: ColumnUtilityService) {}

  COLUMN_DEFS: ColDef[] = [
    {
      checkboxSelection: true,
      headerName: translate('caseView.caseTable.gqId'),
      field: 'gqId',
      valueFormatter: ColumnUtilityService.idFormatter,
      pinned: 'left',
      cellRenderer: 'gqIdComponent',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.creationDate'),
      field: 'gqCreated',
      valueFormatter: (data) =>
        this.columnUtilityService.dateFormatter(data.value),
      floatingFilterComponent: CustomDateFloatingFilterComponent,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      filter: CustomDateFilterComponent,
      maxWidth: 200,
    },
    {
      headerName: translate('caseView.caseTable.caseName'),
      field: 'caseName',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.sapId'),
      field: 'sapId',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.createdBy'),
      field: 'sapCreatedByUser.name',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.customerNumber'),
      field: 'customerIdentifiers.customerId',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.customerName'),
      field: 'customerName',
      filterParams: FILTER_PARAMS,
    },
  ];
}
