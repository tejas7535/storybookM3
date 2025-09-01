/* eslint-disable max-lines */

import { ColDef } from 'ag-grid-community';

import {
  EMISSION_FACTOR_KG,
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
    field: EMISSION_FACTOR_PC,
    headerName: EMISSION_FACTOR_PC,
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
    valueFormatter: EMISSION_FACTORS_FORMATTER,
    headerTooltip: EMISSION_FACTOR_PC,
  },
  {
    field: EMISSION_FACTOR_KG,
    headerName: EMISSION_FACTOR_KG,
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
    valueFormatter: EMISSION_FACTORS_FORMATTER,
    headerTooltip: EMISSION_FACTOR_KG,
  },
  {
    field: 'maturity',
    headerName: 'maturity',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: TIMESTAMP,
    headerName: TIMESTAMP,
    filter: false,
    valueFormatter: CUSTOM_DATE_FORMATTER,
  },
  {
    field: 'mlcStatus',
    headerName: 'mlcStatus',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: MATERIAL_GROUP,
    headerName: MATERIAL_GROUP,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: PACKAGE_TYPE,
    headerName: PACKAGE_TYPE,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'groupedClassification',
    headerName: 'groupedClassification',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'classificationNode',
    headerName: 'classificationNode',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'cxTiR',
    headerName: 'cxTiR',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'cxTeR',
    headerName: 'cxTeR',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'cxGeR',
    headerName: 'cxGeR',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'impactCategory',
    headerName: 'impactCategory',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'referenceDb',
    headerName: 'referenceDb',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'referenceMl',
    headerName: 'referenceMl',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'dataOwner',
    headerName: 'dataOwner',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
];
