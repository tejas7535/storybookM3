import { ColDef } from 'ag-grid-community';

import { MATERIAL_NUMBERS } from '@mac/feature/materials-supplier-database/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config';

import { BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS } from '../base';

export const COPPER_MATERIAL_STANDARDS_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS,
  {
    field: MATERIAL_NUMBERS,
    headerName: 'Material Numbers',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
];
