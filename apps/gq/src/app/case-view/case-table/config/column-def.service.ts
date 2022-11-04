import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-enterprise';

import {
  FILTER_PARAMS,
  MULTI_COLUMN_FILTER,
  SET_COLUMN_FILTER,
  TEXT_COLUMN_FILTER,
} from '../../../shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '../../../shared/ag-grid/services/column-utility.service';
import { timestampRegex } from '../../../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  DATE_FILTER_PARAMS = {
    filters: [
      {
        filter: TEXT_COLUMN_FILTER,
        filterParams: {
          defaultOption: 'startsWith',
          suppressAndOrCondition: true,
          buttons: ['reset'],
          textFormatter: (val: string) => {
            if (timestampRegex.test(val)) {
              return this.columnUtilityService.dateFormatter(val);
            }

            return val;
          },
        },
      },
      {
        filter: SET_COLUMN_FILTER,
        filterParams: {
          valueFormatter: (params: any) =>
            this.columnUtilityService.dateFormatter(params.value),
        },
      },
    ],
  };

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
      width: 175,
    },
    {
      headerName: translate('caseView.caseTable.creationDate'),
      field: 'gqCreated',
      valueFormatter: (data) =>
        this.columnUtilityService.dateFormatter(data.data.gqCreated),
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.DATE_FILTER_PARAMS,
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
    {
      headerName: translate('caseView.caseTable.lastUpdatedDate'),
      field: 'gqLastUpdated',
      valueFormatter: (data) =>
        this.columnUtilityService.dateFormatter(data.data.gqLastUpdated),
      sort: 'desc',
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.DATE_FILTER_PARAMS,
    },
  ];
}
