import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import { SapPriceDetailsColumnFields } from '../../../../shared/ag-grid/constants/column-fields.enum';
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
      field: SapPriceDetailsColumnFields.SAP_SEQUENCE_ID,
      hide: true,
      sort: 'asc',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.condition'),
      field: SapPriceDetailsColumnFields.SAP_CONDITION_TYPE,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.description'),
      field: SapPriceDetailsColumnFields.SAP_CONDITION_DESCRIPTION,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.amount'),
      field: SapPriceDetailsColumnFields.SAP_AMOUNT,
      valueFormatter: ColumnUtilityService.sapConditionAmountFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('sapView.sapConditionsTable.pricingUnit'),
      field: SapPriceDetailsColumnFields.SAP_PRICING_UNIT,
      valueFormatter: ColumnUtilityService.blankTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.conditionUnit'),
      field: SapPriceDetailsColumnFields.SAP_CONDITION_UNIT,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.conditionValue'),
      field: SapPriceDetailsColumnFields.SAP_CONDITION_VALUE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('sapView.sapConditionsTable.validTo'),
      field: SapPriceDetailsColumnFields.SAP_VALID_TO,
      filter: DATE_COLUMN_FILTER,
      valueFormatter: ColumnUtilityService.dateFormatter,
      filterParams: ColumnUtilityService.dateFilterParams,
    },
  ];
}
