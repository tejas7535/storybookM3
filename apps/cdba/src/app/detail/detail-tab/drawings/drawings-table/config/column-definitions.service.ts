import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-enterprise';

import {
  ColumnUtilsService,
  scrambleMaterialDesignation,
  valueGetterDate,
} from '@cdba/shared/components/table';
import { Drawing } from '@cdba/shared/models';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  public COLUMN_DEFINITIONS: ColDef[] = [
    {
      field: 'version',
      colId: 'version',
      headerName: translate('drawings.headers.version'),
      flex: 1,
    },
    {
      field: 'status',
      colId: 'status',
      headerName: translate('drawings.headers.status'),
      flex: 1,
    },
    {
      field: 'part',
      colId: 'part',
      headerName: translate('drawings.headers.part'),
      flex: 1,
    },
    {
      field: 'date',
      colId: 'date',
      headerName: translate('drawings.headers.date'),
      valueGetter: (params) => valueGetterDate<Drawing>(params, 'date'),
      valueFormatter: this.columnUtilsService.formatDate,
      initialSort: 'desc',
      filter: 'agDateColumnFilter',
      flex: 2,
    },
    {
      field: 'type',
      colId: 'type',
      initialSort: 'desc',
      headerName: translate('drawings.headers.type'),
      flex: 1.5,
    },
    {
      field: 'filetype',
      colId: 'filetype',
      headerName: translate('drawings.headers.filetype'),
      flex: 1,
    },
    {
      field: 'number',
      colId: 'documentNumber',
      headerName: translate('drawings.headers.documentNumber'),
      valueFormatter: (params) => scrambleMaterialDesignation(params, 0),
      flex: 2,
    },
    {
      field: 'url',
      colId: 'actions',
      headerName: '',
      sortable: false,
      cellRenderer: 'actionsCellRenderer',
      lockPinned: true,
      pinned: 'right',
      maxWidth: 60,
    },
  ];

  constructor(private readonly columnUtilsService: ColumnUtilsService) {}
}
