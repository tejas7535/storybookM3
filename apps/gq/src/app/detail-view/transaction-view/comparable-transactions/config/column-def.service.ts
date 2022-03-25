import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import {
  FILTER_PARAMS,
  NUMBER_COLUMN_FILTER,
} from '../../../../shared/ag-grid/constants/filters';
import { ColumnUtilityService } from '../../../../shared/ag-grid/services/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('transactionView.transactions.table.customerId'),
      field: 'customerId',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('transactionView.transactions.table.customerName'),
      field: 'customerName',
      filterParams: FILTER_PARAMS,
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
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('transactionView.transactions.table.quantity'),
      field: 'quantity',
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('transactionView.transactions.table.profitMargin'),
      field: 'profitMargin',
      valueFormatter: ColumnUtilityService.percentageFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate(
        'transactionView.transactions.table.salesIndication'
      ),
      field: 'salesIndication',
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
      headerName: translate('transactionView.transactions.table.competitor'),
      field: 'competitor',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'transactionView.transactions.table.relativeCompetitorPrice'
      ),
      field: 'relativeCompetitorPrice',
      filterParams: FILTER_PARAMS,
    },
  ];
}
