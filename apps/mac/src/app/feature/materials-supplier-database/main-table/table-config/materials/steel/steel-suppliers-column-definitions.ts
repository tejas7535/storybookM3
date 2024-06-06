import { ColDef } from 'ag-grid-community';

import { MANUFACTURER } from '@mac/feature/materials-supplier-database/constants';
import { MANUFACTURER_VALUE_GETTER } from '@mac/msd/main-table/table-config/helpers';
import { BASE_SUPPLIERS_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

import { EditCellRendererComponent } from '../../../cell-renderers/edit-cell-renderer/edit-cell-renderer.component';

export const STEEL_SUPPLIERS_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_SUPPLIERS_COLUMN_DEFINITIONS,
  {
    field: MANUFACTURER,
    headerName: MANUFACTURER,
    hide: true,
    cellRenderer: EditCellRendererComponent,
    valueGetter: MANUFACTURER_VALUE_GETTER,
  },
];
