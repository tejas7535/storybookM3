import { Injectable } from '@angular/core';

import { EditCaseMaterialComponent } from '@gq/shared/ag-grid/cell-renderer/edit-cells';
import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-enterprise';

import { ColumnUtilityService } from '../../../../ag-grid/services/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class InputTableColumnDefService {
  constructor(private readonly columnUtilityService: ColumnUtilityService) {}
  BASE_COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('shared.caseMaterial.table.info.title'),
      field: 'info',
      cellRenderer: 'infoCellComponent',
      flex: 0.15,
      sortable: true,
      comparator: ColumnUtilityService.infoComparator,
    },
    {
      headerName: translate('shared.caseMaterial.table.materialDescription'),
      field: 'materialDescription',
      flex: 0.25,
      sortable: true,
      cellRenderer: EditCaseMaterialComponent,
    },
    {
      headerName: translate('shared.caseMaterial.table.materialNumber'),
      field: 'materialNumber',
      flex: 0.25,
      sortable: true,
      cellRenderer: EditCaseMaterialComponent,
      valueFormatter: (params) =>
        this.columnUtilityService.materialTransform(params),
    },
    {
      headerName: translate('shared.caseMaterial.table.quantity'),
      field: 'quantity',
      flex: 0.15,
      sortable: true,
      cellRenderer: EditCaseMaterialComponent,
      valueFormatter: (params) =>
        this.columnUtilityService.numberFormatter(params),
    },
  ];
}
