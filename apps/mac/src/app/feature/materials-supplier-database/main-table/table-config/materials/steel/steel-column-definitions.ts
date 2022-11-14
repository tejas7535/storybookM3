import { ColDef } from 'ag-grid-enterprise';

import {
  CASTING_DIAMETER,
  CASTING_MODE,
  MANUFACTURER,
  MANUFACTURER_SUPPLIER_SELFCERTIFIED,
  MATERIAL_NUMBERS,
  MAX_DIMENSION,
  MIN_DIMENSION,
  RATING,
  RATING_REMARK,
  RELEASE_DATE,
  SAP_SUPPLIER_IDS,
  STEEL_MAKING_PROCESS,
} from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import {
  FILTER_PARAMS,
  MANUFACTURER_VALUE_GETTER,
  RELEASE_DATE_FORMATTER,
  RELEASE_DATE_VALUE_GETTER,
} from '@mac/msd/main-table/table-config';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

export const STEEL_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_COLUMN_DEFINITIONS,
  {
    field: MATERIAL_NUMBERS,
    headerName: 'Material Numbers',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER,
    headerName: 'Iron- & Steelmaking',
    hide: true,
    cellRenderer: EditCellRendererComponent,
    valueGetter: MANUFACTURER_VALUE_GETTER,
  },
  {
    field: SAP_SUPPLIER_IDS,
    headerName: 'SAP Supplier ID(s)',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: MIN_DIMENSION,
    headerName: 'Min Dimension',
    filter: 'agNumberColumnFilter',
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MAX_DIMENSION,
    headerName: 'Max Dimension',
    filter: 'agNumberColumnFilter',
    headerTooltip: MAX_DIMENSION,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RATING,
    headerName: 'Supplier Rating',
    filterParams: FILTER_PARAMS,
    headerTooltip: RATING,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RATING_REMARK,
    headerName: 'Rating Remark',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CASTING_MODE,
    headerName: 'Casting Mode',
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: CASTING_MODE,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CASTING_DIAMETER,
    headerName: 'Casting Diameter',
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: CASTING_DIAMETER,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: STEEL_MAKING_PROCESS,
    headerName: 'Steel Making Process',
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: STEEL_MAKING_PROCESS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RELEASE_DATE,
    headerName: 'Release Date',
    cellRenderer: EditCellRendererComponent,
    valueFormatter: RELEASE_DATE_FORMATTER,
    valueGetter: RELEASE_DATE_VALUE_GETTER,
    filter: 'agDateColumnFilter',
  },
  {
    field: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
    headerName: 'Self Certified',
    hide: true,
    headerTooltip: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
  },
];
