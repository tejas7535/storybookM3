import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ColDef, ValueFormatterParams } from 'ag-grid-enterprise';

import { CaseTableColumnFields } from '../../../shared/ag-grid/constants/column-fields.enum';
import {
  FILTER_PARAMS,
  MULTI_COLUMN_FILTER,
  SET_COLUMN_FILTER,
  TEXT_COLUMN_FILTER,
} from '../../../shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '../../../shared/ag-grid/services/column-utility.service';
import { timestampRegex } from '../../../shared/constants';
import { SAP_SYNC_STATUS } from '../../../shared/models/quotation-detail/sap-sync-status.enum';

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
      field: CaseTableColumnFields.GQ_ID,
      valueFormatter: ColumnUtilityService.idFormatter,
      pinned: 'left',
      cellRenderer: 'gqIdComponent',
      filterParams: FILTER_PARAMS,
      width: 175,
    },
    {
      headerName: translate('caseView.caseTable.creationDate'),
      field: CaseTableColumnFields.GQ_CREATED,
      valueFormatter: (data) =>
        this.columnUtilityService.dateFormatter(data.data.gqCreated),
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.DATE_FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.syncStatus'),
      field: CaseTableColumnFields.SAP_SYNC_STATUS,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) => {
          if (params.value === SAP_SYNC_STATUS.SYNCED.toString()) {
            return translate('shared.sapStatusLabels.synced');
          } else if (params.value === SAP_SYNC_STATUS.NOT_SYNCED.toString()) {
            return translate('shared.sapStatusLabels.notSynced');
          } else {
            return translate('shared.sapStatusLabels.partiallySynced');
          }
        },
      },
      cellRenderer: 'SapStatusCellComponent',
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value === SAP_SYNC_STATUS.SYNCED) {
          return translate('shared.sapStatusLabels.synced');
        } else if (params.value === SAP_SYNC_STATUS.NOT_SYNCED) {
          return translate('shared.sapStatusLabels.notSynced');
        } else {
          return translate('shared.sapStatusLabels.partiallySynced');
        }
      },
    },
    {
      headerName: translate('caseView.caseTable.caseName'),
      field: CaseTableColumnFields.CASE_NAME,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.sapId'),
      field: CaseTableColumnFields.SAP_ID,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.createdBy'),
      field: CaseTableColumnFields.SAP_CREATED_BY,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.customerNumber'),
      field: CaseTableColumnFields.CUSTOMER_NUMBER,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.customerName'),
      field: CaseTableColumnFields.CUSTOMER_NAME,
      filterParams: FILTER_PARAMS,
    },
    {
      // headerName depends on quotation status and will be set in column case-table.component
      field: CaseTableColumnFields.LAST_UPDATED,
      valueFormatter: (data) =>
        this.columnUtilityService.dateFormatter(data.data.gqLastUpdated),
      sort: 'desc',
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.DATE_FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.origin.title'),
      field: CaseTableColumnFields.CASE_ORIGIN,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          this.columnUtilityService.caseOriginFormatter(params.value),
      },
      valueFormatter: (params: ValueFormatterParams) =>
        this.columnUtilityService.caseOriginFormatter(params.value.toString()),
    },
  ];
}
