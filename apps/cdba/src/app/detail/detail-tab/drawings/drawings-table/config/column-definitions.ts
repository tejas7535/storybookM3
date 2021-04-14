import { ColDef } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import { formatDate, valueGetterDate } from '@cdba/shared/components/table';

export const COLUMN_DEFINITIONS: ColDef[] = [
  {
    suppressMovable: true,
    checkboxSelection: true,
    sortable: false,
    filter: false,
    resizable: false,
    enablePivot: false,
    enableRowGroup: false,
    filterParams: false,
    suppressColumnsToolPanel: true,
    lockPinned: true,
    suppressAutoSize: true,
    maxWidth: 40,
    pinned: 'left',
    colId: 'checkbox',
  },
  {
    field: 'version',
    colId: 'version',
    headerName: translate('detail.drawings.headers.version'),
  },
  {
    field: 'status',
    colId: 'status',
    headerName: translate('detail.drawings.headers.status'),
  },
  {
    field: 'part',
    colId: 'part',
    headerName: translate('detail.drawings.headers.part'),
  },
  {
    field: 'date',
    colId: 'date',
    headerName: translate('detail.drawings.headers.date'),
    valueGetter: (params) => valueGetterDate(params, 'date'),
    valueFormatter: formatDate,
    filter: 'agDateColumnFilter',
  },
  {
    field: 'type',
    colId: 'type',
    headerName: translate('detail.drawings.headers.type'),
  },
  {
    field: 'number',
    colId: 'documentNumber',
    headerName: translate('detail.drawings.headers.documentNumber'),
  },
  {
    field: 'url',
    colId: 'actions',
    headerName: translate('detail.drawings.headers.actions'),
    cellRenderer: 'actionsCellRenderer',
    lockPinned: true,
    pinned: 'right',
  },
];
