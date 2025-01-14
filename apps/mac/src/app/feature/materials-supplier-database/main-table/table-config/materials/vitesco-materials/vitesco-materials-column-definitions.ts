/* eslint-disable max-lines */

import { ColDef } from 'ag-grid-community';

import {
  EMISSION_FACTOR_PC,
  MATERIAL_DESCRIPTION,
  MATERIAL_GROUP,
  MATERIAL_NUMBER,
  PACKAGE_TYPE,
  TIMESTAMP,
} from '@mac/feature/materials-supplier-database/constants';
import {
  NUMBER_FILTER_PARAMS,
  TEXT_FILTER_PARAMS,
} from '@mac/msd/main-table/table-config';

import {
  CUSTOM_DATE_FORMATTER,
  EMISSION_FACTORS_FORMATTER,
} from '../../helpers';
import { HISTORY_COLUMN_DEFINITION } from '../base';

export const VITESCO_MATERIALS_COLUMN_DEFINITIONS: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
  {
    field: MATERIAL_NUMBER,
    headerName: MATERIAL_NUMBER,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    headerTooltip: MATERIAL_NUMBER,
  },
  {
    field: MATERIAL_DESCRIPTION,
    headerName: MATERIAL_DESCRIPTION,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: MATERIAL_GROUP,
    headerName: MATERIAL_GROUP,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: PACKAGE_TYPE,
    headerName: PACKAGE_TYPE,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: EMISSION_FACTOR_PC,
    headerName: EMISSION_FACTOR_PC,
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
    valueFormatter: EMISSION_FACTORS_FORMATTER,
    headerTooltip: EMISSION_FACTOR_PC,
  },
  {
    field: TIMESTAMP,
    headerName: TIMESTAMP,
    filter: false,
    valueFormatter: CUSTOM_DATE_FORMATTER,
  },
];
