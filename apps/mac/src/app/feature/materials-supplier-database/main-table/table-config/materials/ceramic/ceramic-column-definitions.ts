import { ColDef } from 'ag-grid-enterprise';

import { CONDITION, MATERIAL_STANDARD_STOFF_ID } from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import { MATERIALSTOFFID_LINK_FORMATTER } from '@mac/msd/main-table/table-config/helpers';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

import { LinkCellRendererComponent } from '../../../link-cell-renderer/link-cell-renderer.component';

export const CERAMIC_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_COLUMN_DEFINITIONS,
  {
    field: CONDITION,
    headerName: CONDITION,
    filterParams: FILTER_PARAMS,
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
