import { ColDef } from 'ag-grid-enterprise';

import {
  CASTING_DIAMETER,
  CASTING_MODE,
  MATERIAL_NUMBERS,
  MAX_DIMENSION,
  PRODUCTION_PROCESS,
} from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import { TRANSLATE_VALUE_FORMATTER_FACTORY } from '@mac/msd/main-table/table-config/helpers';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

export const COPPER_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_COLUMN_DEFINITIONS,
  {
    field: MATERIAL_NUMBERS,
    headerName: 'Material Numbers',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MAX_DIMENSION,
    headerName: 'Max Dimension',
    filter: 'agNumberColumnFilter',
    headerTooltip: MAX_DIMENSION,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CASTING_MODE,
    headerName: 'Casting Mode',
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: CASTING_MODE,
    cellRenderer: EditCellRendererComponent,
    valueFormatter: TRANSLATE_VALUE_FORMATTER_FACTORY(
      'materialsSupplierDatabase.mainTable.dialog',
      true
    ),
  },
  {
    field: CASTING_DIAMETER,
    headerName: 'Casting Diameter',
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: CASTING_DIAMETER,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: PRODUCTION_PROCESS,
    headerName: 'Production Process',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
];
