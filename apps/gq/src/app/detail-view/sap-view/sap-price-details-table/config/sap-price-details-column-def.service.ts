import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-enterprise';

import { SapPriceDetailsColumnFields } from '../../../../shared/ag-grid/constants/column-fields.enum';
import {
  FILTER_PARAMS,
  MULTI_COLUMN_FILTER,
  MULTI_COLUMN_FILTER_PARAMS,
  NUMBER_COLUMN_FILTER,
} from '../../../../shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '../../../../shared/ag-grid/services/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class SapPriceDetailsColumnDefService {
  constructor(private readonly columnUtilityService: ColumnUtilityService) {}

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
      valueFormatter: (data) =>
        this.columnUtilityService.sapConditionAmountFormatter(data),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
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
      valueFormatter: ColumnUtilityService.transformConditionUnit,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('sapView.sapConditionsTable.conditionValue'),
      field: SapPriceDetailsColumnFields.SAP_CONDITION_VALUE,
      valueFormatter: (data) =>
        this.columnUtilityService.numberCurrencyFormatter(data),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
    },
    {
      headerName: translate('sapView.sapConditionsTable.validTo'),
      field: SapPriceDetailsColumnFields.SAP_VALID_TO,
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(
          data.data[SapPriceDetailsColumnFields.SAP_VALID_TO]
        ),
      filter: MULTI_COLUMN_FILTER,
      filterParams: MULTI_COLUMN_FILTER_PARAMS,
    },
  ];
}
