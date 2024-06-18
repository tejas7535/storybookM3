import { inject, Injectable } from '@angular/core';

import { SearchByCasesOrMaterialsColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
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
import {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-enterprise';

import { ColumnUtilityService as SearchResultsColumnUtilityService } from './column-utility.service';
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
  private readonly searchResultsColumnUtilityService = inject(
    SearchResultsColumnUtilityService
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
      headerName: translate('searchBarAdvanced.resultsTable.columns.gqId'),
      field: SearchByCasesOrMaterialsColumnFields.GQ_ID,
      valueFormatter: (params: ValueFormatterParams) =>
        GeneralColumnUtilityService.idFormatter({ value: params.data.gqId }),
      filterParams: FILTER_PARAMS,
      lockPosition: 'left',
      cellRenderer: 'gqIdComponent',
      cellRendererParams: (params: any) => ({
        data: this.searchResultsColumnUtilityService.viewQuotationGetter(
          params
        ),
      }),
      valueGetter: (params: ValueGetterParams) =>
        GeneralColumnUtilityService.idFormatter({ value: params.data.gqId }),
      width: 175,
    },
    {
      headerName: translate('searchBarAdvanced.resultsTable.columns.gqCreated'),
      field: SearchByCasesOrMaterialsColumnFields.GQ_CREATED,
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.dateFilterParamService.DATE_FILTER_PARAMS,
      comparator: this.comparatorService.compareTranslocoDateAsc,
      valueGetter: (params: ValueGetterParams) =>
        this.generalColumnUtilityService.dateFormatter(params.data.gqCreated),
    },
    {
      headerName: translate(
        'searchBarAdvanced.resultsTable.columns.gqCreatedByUser'
      ),
      field: SearchByCasesOrMaterialsColumnFields.GQ_CREATED_BY,
      valueFormatter: GeneralColumnUtilityService.basicTransform,
      valueGetter: (params: ValueGetterParams) =>
        this.searchResultsColumnUtilityService.createdByGetter(params.data),
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('searchBarAdvanced.resultsTable.columns.sapId'),
      valueFormatter: GeneralColumnUtilityService.basicTransform,
      field: SearchByCasesOrMaterialsColumnFields.SAP_ID,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'searchBarAdvanced.resultsTable.columns.customerId'
      ),
      field: SearchByCasesOrMaterialsColumnFields.CUSTOMER_ID,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'searchBarAdvanced.resultsTable.columns.customerName'
      ),
      field: SearchByCasesOrMaterialsColumnFields.CUSTOMER_NAME,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'searchBarAdvanced.resultsTable.columns.gqLastUpdated'
      ),
      field: SearchByCasesOrMaterialsColumnFields.GQ_LAST_UPDATED,
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.dateFilterParamService.DATE_FILTER_PARAMS,
      comparator: this.comparatorService.compareTranslocoDateAsc,
      valueGetter: (params: ValueGetterParams) =>
        this.generalColumnUtilityService.dateFormatter(
          params.data.gqLastUpdated
        ),
      sort: 'desc',
    },
  ];

  CASES_TABLE_COLUMN_DEFS: ColDef[] = [
    ...this.COLUMN_DEFS,
    {
      headerName: translate(
        'searchBarAdvanced.casesResultsTable.columns.totalNetValue'
      ),
      field: SearchByCasesOrMaterialsColumnFields.TOTAL_NET_VALUE,
      valueFormatter: (params: ValueFormatterParams) =>
        this.searchResultsColumnUtilityService.netValueFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
    },
  ];

  MATERIALS_TABLE_COLUMN_DEFS: ColDef[] = [
    ...this.COLUMN_DEFS.filter((col) => col.field !== 'sapId'),
    {
      headerName: translate(
        'searchBarAdvanced.materialsResultsTable.columns.materialNumber'
      ),
      field: SearchByCasesOrMaterialsColumnFields.MATERIAL_NUMBER_15,
      valueFormatter: (params: ValueFormatterParams) =>
        this.generalColumnUtilityService.materialTransform(params),
      valueGetter: (params: ValueGetterParams) =>
        this.searchResultsColumnUtilityService.materialGetter(params),
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'searchBarAdvanced.materialsResultsTable.columns.materialDescription'
      ),
      field: SearchByCasesOrMaterialsColumnFields.MATERIAL_DESCRIPTION,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'searchBarAdvanced.materialsResultsTable.columns.customerMaterial'
      ),
      field: SearchByCasesOrMaterialsColumnFields.CUSTOMER_MATERIAL,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'searchBarAdvanced.materialsResultsTable.columns.quantity'
      ),
      field: SearchByCasesOrMaterialsColumnFields.QUANTITY,
      filter: NUMBER_COLUMN_FILTER,
      valueFormatter: (params: ValueFormatterParams) =>
        this.generalColumnUtilityService.numberDashFormatter(params),
    },
    {
      headerName: translate(
        'searchBarAdvanced.materialsResultsTable.columns.price'
      ),
      field: SearchByCasesOrMaterialsColumnFields.PRICE,
      filter: NUMBER_COLUMN_FILTER,
      valueFormatter: (params: ValueFormatterParams) =>
        this.searchResultsColumnUtilityService.netValueFormatter(params),
    },
    {
      headerName: translate(
        'searchBarAdvanced.materialsResultsTable.columns.gpi'
      ),
      field: SearchByCasesOrMaterialsColumnFields.GPI,
      filter: NUMBER_COLUMN_FILTER,
      valueFormatter: (params: ValueFormatterParams) =>
        this.generalColumnUtilityService.percentageFormatter(params),
      valueGetter: (params: ValueGetterParams) =>
        this.searchResultsColumnUtilityService.gpiGetter(params),
      comparator: GeneralColumnUtilityService.numberAsStringComparator,
    },
  ];

  MATERIALS_TABLE_COLUMN_DEFS_WITHOUT_GPI: ColDef[] =
    this.MATERIALS_TABLE_COLUMN_DEFS.filter(
      (col) => col.field !== SearchByCasesOrMaterialsColumnFields.GPI
    );
}
