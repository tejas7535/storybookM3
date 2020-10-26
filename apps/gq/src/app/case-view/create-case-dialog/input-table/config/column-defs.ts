import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

export const COLUMN_DEFS: ColDef[] = [
  {
    headerName: translate(
      'caseView.createCaseDialog.customer.table.materialNumber'
    ),
    field: 'materialNumber',
    flex: 0.4,
  },
  {
    headerName: translate('caseView.createCaseDialog.customer.table.quantity'),
    field: 'quantity',
    flex: 0.4,
  },
  {
    headerName: translate('caseView.createCaseDialog.customer.table.info'),
    field: 'info',
    cellRenderer: 'infoCellComponent',
    flex: 0.1,
  },
  {
    headerName: translate('caseView.createCaseDialog.customer.table.action'),
    cellRenderer: 'actionCellComponent',
    flex: 0.1,
  },
];
