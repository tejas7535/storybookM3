import { ColDef } from 'ag-grid-enterprise';

import {
  COATING,
  GRADE,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
  PRODUCT_CATEGORY,
  PRODUCTION_PROCESS,
} from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

const exclude = (columns: string[], colDef: ColDef[]): ColDef[] =>
  colDef.filter((cd) => !columns.includes(cd.field));

export const HARDMAGNET_COLUMN_DEFINITIONS: ColDef[] = [
  // base view without 'product category' and 'material standard document'
  ...exclude(
    [MATERIAL_STANDARD_STANDARD_DOCUMENT, PRODUCT_CATEGORY],
    BASE_COLUMN_DEFINITIONS
  ),
  {
    field: GRADE,
    headerName: GRADE,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: COATING,
    headerName: COATING,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: PRODUCTION_PROCESS,
    headerName: PRODUCTION_PROCESS,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
];
