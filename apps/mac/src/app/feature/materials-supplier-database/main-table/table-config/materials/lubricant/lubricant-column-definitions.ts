import { ColDef } from 'ag-grid-community';

import {
  CO2_CLASSIFICATION,
  CO2TYPE,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_PLANT,
  MANUFACTURER_SUPPLIER_REGION,
  MATERIAL_NUMBERS,
  MATERIAL_STANDARD_STOFF_ID,
  PRODUCT_CATEGORY,
  RECENT_STATUS,
  RELEASE_RESTRICTIONS,
  SAP_MATERIAL_ID,
} from '@mac/msd/constants';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

import { LinkCellRendererComponent } from '../../../cell-renderers/link-cell-renderer/link-cell-renderer.component';
import { excludeColumn, MATERIALSTOFFID_LINK_FORMATTER } from '../../helpers';

export const LUBRICANT_COLUMN_DEFINITIONS: ColDef[] = [
  ...excludeColumn(
    [
      RECENT_STATUS,
      MANUFACTURER_SUPPLIER_PLANT,
      MANUFACTURER_SUPPLIER_REGION,
      MANUFACTURER_SUPPLIER_COUNTRY,
      CO2_CLASSIFICATION,
      PRODUCT_CATEGORY,
      RELEASE_RESTRICTIONS,
    ],
    BASE_COLUMN_DEFINITIONS
  ),
  {
    field: SAP_MATERIAL_ID,
    headerName: 'materialSapId',
    filterParams: FILTER_PARAMS,
    hide: false,
  },
  {
    field: MATERIAL_NUMBERS,
    headerName: MATERIAL_NUMBERS,
    filterParams: FILTER_PARAMS,
    hide: false,
  },
  {
    field: MATERIAL_STANDARD_STOFF_ID,
    headerName: MATERIAL_STANDARD_STOFF_ID,
    filterParams: FILTER_PARAMS,
    hide: false,
    headerTooltip: MATERIAL_STANDARD_STOFF_ID,
    tooltipValueGetter: (params) => (params.value ? 'wiamLink' : undefined),
    valueFormatter: MATERIALSTOFFID_LINK_FORMATTER,
    cellRenderer: LinkCellRendererComponent,
  },
  {
    field: CO2TYPE,
    headerName: 'co2Type',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
];
