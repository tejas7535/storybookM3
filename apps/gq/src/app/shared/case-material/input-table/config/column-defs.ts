import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { ColumnUtilityService } from '../../../services/create-column-service/column-utility.service';

export const COLUMN_DEFS: ColDef[] = [
  {
    headerName: translate('shared.caseMaterial.table.materialNumber'),
    field: 'materialNumber',
    flex: 0.4,
    sortable: true,
    valueFormatter: ColumnUtilityService.transformMaterial,
  },
  {
    headerName: translate('shared.caseMaterial.table.quantity'),
    field: 'quantity',
    flex: 0.4,
    sortable: true,
  },
  {
    headerName: translate('shared.caseMaterial.table.info.title'),
    field: 'info',
    cellRenderer: 'infoCellComponent',
    flex: 0.1,
    sortable: true,
    comparator: ColumnUtilityService.infoComparator,
  },
  {
    cellRenderer: 'actionCellComponent',
    cellRendererParams: 'createCase',
    flex: 0.1,
  },
];
