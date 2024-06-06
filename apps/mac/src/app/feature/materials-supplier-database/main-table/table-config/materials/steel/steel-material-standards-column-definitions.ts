import { ColDef } from 'ag-grid-community';

import { MATERIAL_NUMBERS } from '@mac/msd/constants';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config';

import { EditCellRendererComponent } from '../../../cell-renderers/edit-cell-renderer/edit-cell-renderer.component';
import { BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS } from '../base';

export const STEEL_MATERIAL_STANDARDS_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS,
  {
    field: MATERIAL_NUMBERS,
    headerName: 'steelNumber',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
];
