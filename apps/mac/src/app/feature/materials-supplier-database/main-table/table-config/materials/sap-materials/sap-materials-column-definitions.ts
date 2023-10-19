import { ColDef, ValueFormatterParams } from 'ag-grid-community';

import {
  BUSINESS_PARTNER_ID,
  CATEGORY,
  CATEGORY_TEXT,
  DATA_COMMENT,
  DATA_DATE,
  EMISSION_FACTOR_KG,
  EMISSION_FACTOR_PC,
  MATERIAL_DESCRIPTION,
  MATERIAL_GROUP,
  MATERIAL_GROUP_TEXT,
  MATERIAL_NUMBER,
  MATURITY,
  OWNER,
  PLANT,
  PLANT_TEXT,
  SUPPLIER_COUNTRY,
  SUPPLIER_ID,
  SUPPLIER_ID_TEXT,
  SUPPLIER_REGION,
  TRANSPORT_INCOTERM,
  TRANSPORT_PC,
} from '@mac/feature/materials-supplier-database/constants';
import {
  DISTINCT_FILTER_PARAMS,
  NUMBER_FILTER_PARAMS,
  TEXT_FILTER_PARAMS,
} from '@mac/msd/main-table/table-config';

import { PcfMaturityCo2CellRendererComponent } from '../../../pcf-maturity-co2-cell-renderer/pcf-maturity-co2-cell-renderer.component';
import { TRANSLATE_VALUE_FORMATTER_FACTORY } from '../../helpers';
import { HISTORY_COLUMN_DEFINITION } from '../base';

export const SAP_MATERIALS_COLUMN_DEFINITIONS: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
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
    filter: 'agSetColumnFilter',
    filterParams: DISTINCT_FILTER_PARAMS,
    tooltipField: MATERIAL_GROUP_TEXT,
    tooltipComponentParams: {
      translate: false,
    },
  },
  {
    field: CATEGORY,
    headerName: CATEGORY,
    filter: 'agSetColumnFilter',
    filterParams: DISTINCT_FILTER_PARAMS,
    tooltipField: CATEGORY_TEXT,
    tooltipComponentParams: {
      translate: false,
    },
  },
  {
    field: BUSINESS_PARTNER_ID,
    headerName: BUSINESS_PARTNER_ID,
    filter: 'agSetColumnFilter',
    filterParams: DISTINCT_FILTER_PARAMS,
  },
  {
    field: SUPPLIER_ID,
    headerName: SUPPLIER_ID,
    filter: 'agSetColumnFilter',
    filterParams: DISTINCT_FILTER_PARAMS,
    tooltipField: SUPPLIER_ID_TEXT,
    tooltipComponentParams: {
      translate: false,
    },
  },
  {
    field: PLANT,
    headerName: PLANT,
    filter: 'agSetColumnFilter',
    filterParams: DISTINCT_FILTER_PARAMS,
    tooltipField: PLANT_TEXT,
    tooltipComponentParams: {
      translate: false,
    },
  },
  {
    field: SUPPLIER_COUNTRY,
    headerName: SUPPLIER_COUNTRY,
    filter: 'agSetColumnFilter',
    filterParams: DISTINCT_FILTER_PARAMS,
  },
  {
    field: SUPPLIER_REGION,
    headerName: SUPPLIER_REGION,
    filter: 'agSetColumnFilter',
    filterParams: DISTINCT_FILTER_PARAMS,
  },
  {
    field: EMISSION_FACTOR_KG,
    headerName: EMISSION_FACTOR_KG,
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
    cellRenderer: PcfMaturityCo2CellRendererComponent,
  },
  {
    field: EMISSION_FACTOR_PC,
    headerName: EMISSION_FACTOR_PC,
    filter: 'agNumberColumnFilter',
    filterParams: NUMBER_FILTER_PARAMS,
    cellRenderer: PcfMaturityCo2CellRendererComponent,
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
    field: MATURITY,
    headerName: MATURITY,
    filter: 'agSetColumnFilter',
    filterParams: {
      ...DISTINCT_FILTER_PARAMS,
      valueFormatter: TRANSLATE_VALUE_FORMATTER_FACTORY(
        'materialsSupplierDatabase.dataSource'
      ),
      suppressSorting: true,
    },
    valueFormatter: TRANSLATE_VALUE_FORMATTER_FACTORY(
      'materialsSupplierDatabase.dataSource'
    ),
  },
  {
    field: OWNER,
    headerName: OWNER,
    filter: 'agSetColumnFilter',
    filterParams: DISTINCT_FILTER_PARAMS,
  },
];
