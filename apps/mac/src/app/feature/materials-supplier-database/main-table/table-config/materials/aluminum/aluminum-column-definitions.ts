import { ColDef } from 'ag-grid-community';

import { MATERIAL_STANDARD_STOFF_ID, RECYCLING_RATE } from '@mac/msd/constants';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import {
  MATERIALSTOFFID_LINK_FORMATTER,
  RECYCLING_RATE_FILTER_VALUE_GETTER,
  RECYCLING_RATE_VALUE_GETTER,
} from '@mac/msd/main-table/table-config/helpers';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

import { EditCellRendererComponent } from '../../../cell-renderers/edit-cell-renderer/edit-cell-renderer.component';
import { LinkCellRendererComponent } from '../../../cell-renderers/link-cell-renderer/link-cell-renderer.component';

export const ALUMINUM_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_COLUMN_DEFINITIONS,
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
