import { ColDef } from 'ag-grid-enterprise';

import {
  GENERAL_DESCRIPTION,
  MATERIAL_NUMBERS,
  RELEASE_DATE,
  SAP_SUPPLIER_IDS,
  SSID,
} from '@mac/msd/constants';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import {
  RELEASE_DATE_FORMATTER,
  RELEASE_DATE_VALUE_GETTER,
} from '@mac/msd/main-table/table-config/helpers';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

export const POLYMER_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_COLUMN_DEFINITIONS,
  {
    field: SAP_SUPPLIER_IDS,
    headerName: SAP_SUPPLIER_IDS,
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: SSID,
    headerName: SSID,
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: GENERAL_DESCRIPTION,
    headerName: GENERAL_DESCRIPTION,
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: MATERIAL_NUMBERS,
    headerName: MATERIAL_NUMBERS,
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: RELEASE_DATE,
    headerName: RELEASE_DATE,
    valueFormatter: RELEASE_DATE_FORMATTER,
    valueGetter: RELEASE_DATE_VALUE_GETTER,
    filter: 'agDateColumnFilter',
  },
];
