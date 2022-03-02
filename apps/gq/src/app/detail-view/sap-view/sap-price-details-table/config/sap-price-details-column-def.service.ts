import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import {
  DATE_COLUMN_FILTER,
  FILTER_PARAMS,
  NUMBER_COLUMN_FILTER,
} from '../../../../shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '../../../../shared/ag-grid/services/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class SapPriceDetailsColumnDefService {
  COLUMN_DEFS: ColDef[] = [
    {
      field: 'sequenceId',
      hide: true,
      sort: 'asc',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.condition'),
      field: 'sapConditionType',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.description'),
      field: 'conditionTypeDescription',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.amount'),
      field: 'amount',
      valueFormatter: ColumnUtilityService.sapConditionAmountFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('sapView.sapConditionsTable.pricingUnit'),
      field: 'pricingUnit',
      valueFormatter: ColumnUtilityService.blankTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.conditionUnit'),
      field: 'conditionUnit',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.conditionValue'),
      field: 'conditionValue',
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('sapView.sapConditionsTable.validTo'),
      field: 'validTo',
      filter: DATE_COLUMN_FILTER,
      valueFormatter: ColumnUtilityService.dateFormatter,
      filterParams: ColumnUtilityService.dateFilterParams,
    },
  ];
}
