import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

export const dateFormatter = (data: any): string => {
  return data.value ? new Date(data.value).toLocaleDateString() : '';
};

export const COLUMN_DEFS: ColDef[] = [
  {
    checkboxSelection: true,
    pinned: 'left',
    width: 30,
    filter: false,
    resizable: false,
    suppressMenu: true,
  },
  {
    headerName: translate('caseView.caseTable.patCase'),
    field: 'gqId',
  },
  {
    headerName: translate('caseView.caseTable.sapId'),
    field: 'sapId',
  },
  {
    headerName: translate('caseView.caseTable.customerId'),
    field: 'customer.id',
  },
  {
    headerName: translate('caseView.caseTable.customerName'),
    field: 'customer.name',
  },
  {
    headerName: translate('caseView.caseTable.creationDate'),
    field: 'gqCreated',
    filter: 'agDateColumnFilter',
    valueFormatter: dateFormatter,
  },
  {
    headerName: translate('caseView.caseTable.status'),
    field: 'status',
  },
  {
    headerName: translate('caseView.caseTable.synchronized'),
    field: 'synchronized',
  },
];
