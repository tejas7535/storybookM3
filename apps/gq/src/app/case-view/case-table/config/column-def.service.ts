import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-enterprise';

import {
  FILTER_PARAMS,
  MULTI_COLUMN_FILTER,
  MULTI_COLUMN_FILTER_PARAMS,
} from '../../../shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '../../../shared/ag-grid/services/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  constructor(private readonly columnUtilityService: ColumnUtilityService) {}

  COLUMN_DEFS: ColDef[] = [
    {
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
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
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(data.data.gqCreated),
      filter: MULTI_COLUMN_FILTER,
      filterParams: MULTI_COLUMN_FILTER_PARAMS,
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
