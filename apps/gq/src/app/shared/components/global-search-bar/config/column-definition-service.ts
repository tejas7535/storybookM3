import { inject, Injectable } from '@angular/core';

import { SearchByCasesColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import {
  FILTER_PARAMS,
  MULTI_COLUMN_FILTER,
  NUMBER_COLUMN_FILTER,
} from '@gq/shared/ag-grid/constants/filters';
import {
  ColumnUtilityService as GeneralColumnUtilityService,
  ComparatorService,
} from '@gq/shared/ag-grid/services';
import { DateFilterParamService } from '@gq/shared/ag-grid/services/date-filter-param/date-filter-param.service';
import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-community';

import { ColumnUtilityService as CasesResultsColumnUtilityService } from './column-utility.service';
import {
  COMPONENTS,
  DEFAULT_COL_DEF,
  DEFAULT_GRID_OPTIONS,
  GRID_OPTIONS,
  GRID_OPTIONS_WITHOUT_PAGINATION,
} from './default-config';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  private readonly generalColumnUtilityService = inject(
    GeneralColumnUtilityService
  );
  private readonly casesResultsColumnUtilityService = inject(
    CasesResultsColumnUtilityService
  );
  private readonly comparatorService = inject(ComparatorService);
  private readonly dateFilterParamService = inject(DateFilterParamService);

  COMPONENTS = COMPONENTS;
  DEFAULT_COL_DEF = DEFAULT_COL_DEF;
  DEFAULT_GRID_OPTIONS = DEFAULT_GRID_OPTIONS;
  GRID_OPTIONS = GRID_OPTIONS;
  GRID_OPTIONS_WITHOUT_PAGINATION = GRID_OPTIONS_WITHOUT_PAGINATION;

  COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('searchBarAdvanced.casesResultsTable.columns.gqId'),
      field: SearchByCasesColumnFields.GQ_ID,
      valueFormatter: (params) =>
        GeneralColumnUtilityService.idFormatter({ value: params.data.gqId }),
      filterParams: FILTER_PARAMS,
      lockPosition: 'left',
      cellRenderer: 'gqIdComponent',
      cellRendererParams: (params: any) => ({
        data: this.casesResultsColumnUtilityService.viewQuotationGetter(params),
      }),
      valueGetter: (params) =>
        GeneralColumnUtilityService.idFormatter({ value: params.data.gqId }),
      width: 175,
    },

    {
      headerName: translate(
        'searchBarAdvanced.casesResultsTable.columns.sapId'
      ),
      valueFormatter: GeneralColumnUtilityService.basicTransform,
      field: SearchByCasesColumnFields.SAP_ID,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'searchBarAdvanced.casesResultsTable.columns.customerId'
      ),
      field: SearchByCasesColumnFields.CUSTOMER_ID,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'searchBarAdvanced.casesResultsTable.columns.customerName'
      ),
      field: SearchByCasesColumnFields.CUSTOMER_NAME,
      filterParams: FILTER_PARAMS,
    },

    {
      headerName: translate(
        'searchBarAdvanced.casesResultsTable.columns.gqCreatedByUser'
      ),
      field: SearchByCasesColumnFields.GQ_CREATED_BY,
      valueFormatter: GeneralColumnUtilityService.basicTransform,
      valueGetter: (params) =>
        this.casesResultsColumnUtilityService.createdByGetter(params.data),
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'searchBarAdvanced.casesResultsTable.columns.gqCreated'
      ),
      field: SearchByCasesColumnFields.GQ_CREATED,
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.dateFilterParamService.DATE_FILTER_PARAMS,
      comparator: this.comparatorService.compareTranslocoDateAsc,
      valueGetter: (params) =>
        this.generalColumnUtilityService.dateFormatter(params.data.gqCreated),
    },
    {
      headerName: translate(
        'searchBarAdvanced.casesResultsTable.columns.gqLastUpdated'
      ),
      field: SearchByCasesColumnFields.GQ_LAST_UPDATED,
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.dateFilterParamService.DATE_FILTER_PARAMS,
      comparator: this.comparatorService.compareTranslocoDateAsc,
      valueGetter: (params) =>
        this.generalColumnUtilityService.dateFormatter(
          params.data.gqLastUpdated
        ),
      sort: 'desc',
    },
    {
      headerName: translate(
        'searchBarAdvanced.casesResultsTable.columns.totalNetValue'
      ),
      field: SearchByCasesColumnFields.TOTAL_NET_VALUE,
      valueFormatter: (params) =>
        this.casesResultsColumnUtilityService.totalNetValueFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
    },
  ];
}
