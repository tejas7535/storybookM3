import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { ColumnUtilityService } from '../../../../shared/services/column-utility-service/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class SapPriceDetailsColumnDefService {
  COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('sapView.sapConditionsTable.condition'),
      field: 'sapConditionType',
    },
    {
      headerName: translate('sapView.sapConditionsTable.description'),
      field: 'conditionTypeDescription',
    },
    {
      headerName: translate('sapView.sapConditionsTable.amount'),
      field: 'amount',
      valueFormatter: ColumnUtilityService.sapConditionAmountFormatter,
    },
    {
      headerName: translate('sapView.sapConditionsTable.pricingUnit'),
      field: 'pricingUnit',
      valueFormatter: ColumnUtilityService.blankTransform,
    },
    {
      headerName: translate('sapView.sapConditionsTable.conditionUnit'),
      field: 'conditionUnit',
    },
    {
      headerName: translate('sapView.sapConditionsTable.conditionValue'),
      field: 'conditionValue',
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
    },
    {
      headerName: translate('sapView.sapConditionsTable.validTo'),
      field: 'validTo',
      filter: 'agDateColumnFilter',
      valueFormatter: ColumnUtilityService.dateFormatter,
      filterParams: ColumnUtilityService.dateFilterParams,
    },
  ];
}
