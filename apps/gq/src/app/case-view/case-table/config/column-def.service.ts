import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { ColumnUtilityService } from '../../../shared/services/column-utility-service/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  COLUMN_DEFS: ColDef[] = [
    {
      checkboxSelection: true,
      headerName: translate('caseView.caseTable.gqId'),
      field: 'gqId',
      valueFormatter: ColumnUtilityService.idFormatter,
      pinned: 'left',
      cellRenderer: 'gqIdComponent',
    },
    {
      headerName: translate('caseView.caseTable.creationDate'),
      field: 'gqCreated',
      filter: 'agDateColumnFilter',
      valueFormatter: ColumnUtilityService.dateFormatter,
      filterParams: ColumnUtilityService.dateFilterParams,
    },
    {
      headerName: translate('caseView.caseTable.sapId'),
      field: 'sapId',
    },
    {
      headerName: translate('caseView.caseTable.createdBy'),
      field: 'sapCreatedByUser.name',
    },
    {
      headerName: translate('caseView.caseTable.customerNumber'),
      field: 'customerIdentifiers.customerId',
    },
    {
      headerName: translate('caseView.caseTable.customerName'),
      field: 'customerName',
    },
  ];
}
