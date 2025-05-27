/* eslint-disable max-lines */

import { ColDef } from 'ag-grid-community';

import { TIMESTAMP } from '@mac/feature/materials-supplier-database/constants';
import {
  NUMBER_FILTER_PARAMS,
  TEXT_FILTER_PARAMS,
} from '@mac/msd/main-table/table-config';

import {
  CUSTOM_DATE_FORMATTER,
  EMISSION_FACTORS_FORMATTER,
} from '../../helpers';

export const ESTIMATION_MATRIX_COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: 'mappingId',
    headerName: 'mappingId',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: 'productGroupId',
    headerName: 'productGroupId',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: 'productGroup',
    headerName: 'productGroup',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: 'supplierCountryCode',
    headerName: 'supplierCountry',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: 'supplierRegionCode',
    headerName: 'supplierRegionCode',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: 'pcfPerKg',
    headerName: 'pcfPerKg',
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
    valueFormatter: EMISSION_FACTORS_FORMATTER,
  },
  {
    field: 'comment',
    headerName: 'comment',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: 'pcfMaterial',
    headerName: 'pcfMaterial',
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
    valueFormatter: EMISSION_FACTORS_FORMATTER,
    hide: true,
  },
  {
    field: 'materialUtilization',
    headerName: 'materialUtilization',
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
    valueFormatter: EMISSION_FACTORS_FORMATTER,
    hide: true,
  },
  {
    field: 'pcfProcess',
    headerName: 'pcfProcess',
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
    valueFormatter: EMISSION_FACTORS_FORMATTER,
    hide: true,
  },
  {
    field: 'version',
    headerName: 'version',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'releaseDate',
    headerName: 'releaseDate',
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: TIMESTAMP,
    headerName: TIMESTAMP,
    filter: false,
    valueFormatter: CUSTOM_DATE_FORMATTER,
    hide: true,
  },
];
