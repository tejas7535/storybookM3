import { ColDef } from 'ag-grid-enterprise';

import {
  GENERAL_DESCRIPTION,
  MATERIAL_NUMBERS,
  RELEASE_DATE,
  SAP_SUPPLIER_IDS,
  SSID,
} from '@mac/msd/constants';
import {
  FILTER_PARAMS,
  RELEASE_DATE_FORMATTER,
  RELEASE_DATE_VALUE_GETTER,
} from '@mac/msd/main-table/table-config';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

export const POLYMER_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_COLUMN_DEFINITIONS,
  {
    field: SAP_SUPPLIER_IDS,
    headerName: 'SAP Supplier ID(s)',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: SSID,
    headerName: 'SSID',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: GENERAL_DESCRIPTION,
    headerName: 'General Description',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: MATERIAL_NUMBERS,
    headerName: 'Material Numbers',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: RELEASE_DATE,
    headerName: 'Release Date',
    valueFormatter: RELEASE_DATE_FORMATTER,
    valueGetter: RELEASE_DATE_VALUE_GETTER,
    filter: 'agDateColumnFilter',
  },
];
