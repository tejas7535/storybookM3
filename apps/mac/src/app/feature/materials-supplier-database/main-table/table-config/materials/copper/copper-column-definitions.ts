import { ColDef } from 'ag-grid-enterprise';

import {
  CASTING_DIAMETER,
  CASTING_MODE,
  MATERIAL_NUMBERS,
  MATERIAL_STANDARD_STOFF_ID,
  MAX_DIMENSION,
  PRODUCTION_PROCESS,
  RECYCLING_RATE,
  REFERENCE_DOCUMENT,
} from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import {
  MATERIALSTOFFID_LINK_FORMATTER,
  RECYCLING_RATE_FILTER_VALUE_GETTER,
  RECYCLING_RATE_VALUE_GETTER,
  TRANSLATE_VALUE_FORMATTER_FACTORY,
} from '@mac/msd/main-table/table-config/helpers';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

import { LinkCellRendererComponent } from '../../../link-cell-renderer/link-cell-renderer.component';

export const COPPER_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_COLUMN_DEFINITIONS,
  {
    field: MATERIAL_NUMBERS,
    headerName: 'copperNumber',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MAX_DIMENSION,
    headerName: MAX_DIMENSION,
    filter: 'agNumberColumnFilter',
    headerTooltip: MAX_DIMENSION,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CASTING_MODE,
    headerName: CASTING_MODE,
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
    headerName: CASTING_DIAMETER,
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: CASTING_DIAMETER,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: PRODUCTION_PROCESS,
    headerName: PRODUCTION_PROCESS,
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: REFERENCE_DOCUMENT,
    headerName: REFERENCE_DOCUMENT,
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RECYCLING_RATE,
    headerName: RECYCLING_RATE,
    filter: 'agNumberColumnFilter',
    filterValueGetter: RECYCLING_RATE_FILTER_VALUE_GETTER,
    valueGetter: RECYCLING_RATE_VALUE_GETTER,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MATERIAL_STANDARD_STOFF_ID,
    headerName: MATERIAL_STANDARD_STOFF_ID,
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: MATERIAL_STANDARD_STOFF_ID,
    tooltipValueGetter: (params) => (params.value ? 'wiamLink' : undefined),
    valueFormatter: MATERIALSTOFFID_LINK_FORMATTER,
    cellRenderer: LinkCellRendererComponent,
  },
];
