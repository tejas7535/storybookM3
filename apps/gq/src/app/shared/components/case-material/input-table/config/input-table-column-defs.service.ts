import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import { ColumnUtilityService } from '../../../../ag-grid/services/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class InputTableColumnDefService {
  constructor(private readonly columnUtilityService: ColumnUtilityService) {}
  BASE_COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('shared.caseMaterial.table.materialDescription'),
      field: 'materialDescription',
      flex: 0.3,
      sortable: true,
    },
    {
      headerName: translate('shared.caseMaterial.table.materialNumber'),
      field: 'materialNumber',
      flex: 0.3,
      sortable: true,
      valueFormatter: ColumnUtilityService.materialTransform,
    },
    {
      headerName: translate('shared.caseMaterial.table.quantity'),
      field: 'quantity',
      flex: 0.2,
      sortable: true,
      valueFormatter: (params) =>
        this.columnUtilityService.numberFormatter(params),
    },
    {
      headerName: translate('shared.caseMaterial.table.info.title'),
      field: 'info',
      cellRenderer: 'infoCellComponent',
      flex: 0.1,
      sortable: true,
      comparator: ColumnUtilityService.infoComparator,
    },
  ];
}
