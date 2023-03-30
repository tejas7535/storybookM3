import { ColDef, ValueFormatterParams } from 'ag-grid-community';

import {
  BUSINESS_PARTNER_ID,
  CATEGORY,
  DATA_COMMENT,
  DATA_DATE,
  EMISSION_FACTOR_KG,
  EMISSION_FACTOR_PC,
  MATERIAL_DESCRIPTION,
  MATERIAL_GROUP,
  MATERIAL_NUMBER,
  NAME,
  OWNER,
  PLANT,
  SUPPLIER_COUNTRY,
  SUPPLIER_ID,
  SUPPLIER_REGION,
  TRANSPORT_INCOTERM,
  TRANSPORT_PC,
} from '@mac/feature/materials-supplier-database/constants';
import {
  NUMBER_FILTER_PARAMS,
  TEXT_FILTER_PARAMS,
} from '@mac/msd/main-table/table-config';

export const SAP_MATERIALS_COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: MATERIAL_NUMBER,
    headerName: MATERIAL_NUMBER,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
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
    field: CATEGORY,
    headerName: CATEGORY,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: BUSINESS_PARTNER_ID,
    headerName: BUSINESS_PARTNER_ID,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: SUPPLIER_ID,
    headerName: SUPPLIER_ID,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: PLANT,
    headerName: PLANT,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: SUPPLIER_COUNTRY,
    headerName: SUPPLIER_COUNTRY,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: SUPPLIER_REGION,
    headerName: SUPPLIER_REGION,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: EMISSION_FACTOR_KG,
    headerName: EMISSION_FACTOR_KG,
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
  },
  {
    field: EMISSION_FACTOR_PC,
    headerName: EMISSION_FACTOR_PC,
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
  },
  {
    field: TRANSPORT_PC,
    headerName: TRANSPORT_PC,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: TRANSPORT_INCOTERM,
    headerName: TRANSPORT_INCOTERM,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
    hide: true,
  },
  {
    field: DATA_DATE,
    headerName: DATA_DATE,
    filter: false,
    valueFormatter: ({ value }: ValueFormatterParams<any, number>) =>
      new Date(value).toLocaleDateString('en-GB'),
  },
  {
    field: DATA_COMMENT,
    headerName: DATA_COMMENT,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: NAME,
    headerName: NAME,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
  {
    field: OWNER,
    headerName: OWNER,
    filter: 'agTextColumnFilter',
    filterParams: TEXT_FILTER_PARAMS,
  },
];
