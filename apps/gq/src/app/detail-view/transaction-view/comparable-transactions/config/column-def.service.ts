import { Injectable } from '@angular/core';

import {
  FILTER_PARAMS,
  NUMBER_COLUMN_FILTER,
} from '@gq/shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services';
import { translate } from '@jsverse/transloco';
import {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-enterprise';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  constructor(private readonly columnUtilityService: ColumnUtilityService) {}

  COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('transactionView.transactions.table.customerName'),
      field: 'customerName',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'transactionView.transactions.table.endsectorCustomer'
      ),
      field: 'endsectorCustomer',
      filterParams: FILTER_PARAMS,
      valueFormatter: ColumnUtilityService.hashTransform,
      valueGetter: (params: ValueGetterParams) =>
        ColumnUtilityService.hashTransform({
          value: params.data.endsectorCustomer,
        } as ValueFormatterParams),
    },
    {
      headerName: translate(
        'transactionView.transactions.table.materialDescription'
      ),
      field: 'materialDescription',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('transactionView.transactions.table.price'),
      field: 'price',
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
    },
    {
      headerName: translate('transactionView.transactions.table.quantity'),
      field: 'quantity',
      filter: NUMBER_COLUMN_FILTER,
      filterParams: ColumnUtilityService.integerFilterParams,
      valueFormatter: (params) =>
        this.columnUtilityService.numberFormatter(params),
    },
    {
      headerName: translate('transactionView.transactions.table.profitMargin'),
      field: 'profitMargin',
      valueFormatter: (params) =>
        this.columnUtilityService.percentageFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
    },
    {
      headerName: translate(
        'transactionView.transactions.table.salesIndication'
      ),
      field: 'salesIndication',
      valueGetter: (params) =>
        this.columnUtilityService.salesIndicationValueGetter(params),
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('transactionView.transactions.table.year'),
      field: 'year',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('transactionView.transactions.table.country'),
      field: 'country',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'transactionView.transactions.table.netSalesClassification'
      ),
      field: 'netSalesClassification',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('transactionView.transactions.table.region'),
      field: 'region',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'transactionView.transactions.table.sectorManagement'
      ),
      field: 'sectorManagement',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('transactionView.transactions.table.customerId'),
      field: 'customerId',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'transactionView.transactions.table.endsectorCustomerNumber'
      ),
      field: 'endsectorCustomerNumber',
      filterParams: FILTER_PARAMS,
      width: 270,
      valueFormatter: ColumnUtilityService.hashTransform,
      valueGetter: (params: ValueGetterParams) =>
        ColumnUtilityService.hashTransform({
          value: params.data.endsectorCustomerNumber,
        } as ValueFormatterParams),
    },
    {
      headerName: translate(
        'transactionView.transactions.table.endSectorSubSector'
      ),
      field: 'endSectorSubSector',
      filterParams: FILTER_PARAMS,
      width: 270,
      valueFormatter: ColumnUtilityService.hashTransform,
      valueGetter: (params: ValueGetterParams) =>
        ColumnUtilityService.hashTransform({
          value: params.data.endSectorSubSector,
        } as ValueFormatterParams),
    },
    {
      headerName: translate('transactionView.transactions.table.competitor'),
      field: 'competitor',
      filterParams: FILTER_PARAMS,
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate(
        'transactionView.transactions.table.relativeCompetitorPrice'
      ),
      field: 'relativeCompetitorPrice',
      filterParams: FILTER_PARAMS,
      valueFormatter: ColumnUtilityService.basicTransform,
    },
  ];
}
