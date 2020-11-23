import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

export const COLUMN_DEFS: ColDef[] = [
  {
    headerName: translate('caseView.caseTable.patCase'),
    field: 'patId',
  },
  {
    headerName: translate('caseView.caseTable.sapId'),
    field: 'sapId',
  },
  {
    headerName: translate('caseView.caseTable.customer'),
    field: 'customer',
  },
  {
    headerName: translate('caseView.caseTable.creationDate'),
    field: 'creationDate',
  },
  {
    headerName: translate('caseView.caseTable.status'),
    field: 'status',
  },
  {
    headerName: translate('caseView.caseTable.synchronized'),
    field: 'synchronized',
  },
  {
    headerName: translate('caseView.caseTable.warnings'),
    field: 'warnings',
  },
];
