import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { ColumnUtilityService } from '../../../../shared/services/column-utility-service/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('transactionView.transactions.table.customerId'),
      field: 'customerId',
    },
    {
      headerName: translate('transactionView.transactions.table.customerName'),
      field: 'customerName',
    },
    {
      headerName: translate(
        'transactionView.transactions.table.materialDescription'
      ),
      field: 'materialDescription',
    },
    {
      headerName: translate('transactionView.transactions.table.price'),
      field: 'price',
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
    },
    {
      headerName: translate('transactionView.transactions.table.quantity'),
      field: 'quantity',
    },
    {
      headerName: translate('transactionView.transactions.table.profitMargin'),
      field: 'profitMargin',
      valueFormatter: ColumnUtilityService.percentageFormatter,
    },
    {
      headerName: translate(
        'transactionView.transactions.table.salesIndication'
      ),
      field: 'salesIndication',
    },
    {
      headerName: translate('transactionView.transactions.table.year'),
      field: 'year',
    },
    {
      headerName: translate('transactionView.transactions.table.country'),
      field: 'country',
    },
    {
      headerName: translate(
        'transactionView.transactions.table.abcClassification'
      ),
      field: 'abcClassification',
    },
    {
      headerName: translate('transactionView.transactions.table.region'),
      field: 'region',
    },
    {
      headerName: translate(
        'transactionView.transactions.table.sectorManagement'
      ),
      field: 'sectorManagement',
    },
  ];
}
