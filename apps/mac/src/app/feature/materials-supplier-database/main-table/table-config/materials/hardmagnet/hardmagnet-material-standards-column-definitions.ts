import { ColDef } from 'ag-grid-enterprise';

import { MATERIAL_STANDARD_STANDARD_DOCUMENT } from '@mac/feature/materials-supplier-database/constants';
import { BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

const exclude = (columns: string[], colDef: ColDef[]): ColDef[] =>
  colDef.filter((cd) => !columns.includes(cd.field));

export const HARDMAGNET_MATERIAL_STANDARDS_COLUMN_DEFINITIONS: ColDef[] = [
  ...exclude(
    [MATERIAL_STANDARD_STANDARD_DOCUMENT],
    BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS
  ),
];
