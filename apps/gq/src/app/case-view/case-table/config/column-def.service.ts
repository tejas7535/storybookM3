import { Injectable } from '@angular/core';

import { CaseTableColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import {
  FILTER_PARAMS,
  MULTI_COLUMN_FILTER,
} from '@gq/shared/ag-grid/constants/filters';
import {
  ColumnUtilityService,
  ComparatorService,
} from '@gq/shared/ag-grid/services';
import { DateFilterParamService } from '@gq/shared/ag-grid/services/date-filter-param/date-filter-param.service';
import { translate } from '@jsverse/transloco';
import { ColDef, ValueFormatterParams } from 'ag-grid-enterprise';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
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
      comparator: this.comparatorService.compareTranslocoDateAsc,
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(data.data.gqCreated),

      filter: MULTI_COLUMN_FILTER,
      filterParams: this.dateFilterParamService.DATE_FILTER_PARAMS,
    },
    {
      headerName: translate('caseView.caseTable.gqCreatedBy'),
      field: CaseTableColumnFields.GQ_CREATED_BY,
      filterParams: FILTER_PARAMS,
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
        this.columnUtilityService.caseOriginFormatter(params.value?.toString()),
    },
    {
      headerName: translate('caseView.caseTable.syncStatus'),
      field: CaseTableColumnFields.SAP_SYNC_STATUS,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          translate('shared.sapStatusLabels.sapSyncStatus', {
            sapSyncStatus: params.value,
          }),
      },
      cellRenderer: 'SapStatusCellComponent',
    },
    {
      headerName: translate('caseView.caseTable.status'),
      field: CaseTableColumnFields.STATUS,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          translate(`shared.quotationStatusLabels.${params.value}`),
      },
      cellRenderer: 'QuotationStatusCellComponent',
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
      comparator: this.comparatorService.compareTranslocoDateAsc,
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(data.data.gqLastUpdated),
      sort: 'desc',
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.dateFilterParamService.DATE_FILTER_PARAMS,
    },
  ];

  constructor(
    private readonly columnUtilityService: ColumnUtilityService,
    private readonly comparatorService: ComparatorService,
    private readonly dateFilterParamService: DateFilterParamService
  ) {}
}
