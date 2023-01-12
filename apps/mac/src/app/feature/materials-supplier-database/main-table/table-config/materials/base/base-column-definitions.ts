import { ColDef } from 'ag-grid-community';

import {
  ACTION,
  CO2_CLASSIFICATION,
  CO2_PER_TON,
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
  PRODUCT_CATEGORY,
  RELEASE_RESTRICTIONS,
  STATUS,
} from '@mac/msd/constants';
import { ActionCellRendererComponent } from '@mac/msd/main-table/action-cell-renderer/action-cell-renderer.component';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { StatusCellRendererComponent } from '@mac/msd/main-table/status-cell-renderer/status-cell-renderer.component';
import {
  CUSTOM_DATE_FORMATTER,
  FILTER_PARAMS,
  STATUS_VALUE_GETTER,
} from '@mac/msd/main-table/table-config';

export const EDITOR_COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: ACTION,
    headerName: 'action',
    filter: false,
    cellRenderer: ActionCellRendererComponent,
    width: 95, // 140 for 3 icons
    pinned: 'right',
    lockPinned: true,
    resizable: false,
    suppressMenu: true,
    suppressMovable: true,
    sortable: false,
    lockVisible: true,
    cellClass: 'px-0',
  },
];

export const BASE_COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: MATERIAL_STANDARD_MATERIAL_NAME,
    headerName: 'Material Name',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MATERIAL_STANDARD_STANDARD_DOCUMENT,
    headerName: 'Standard Document',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_NAME,
    headerName: 'Supplier Name',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_PLANT,
    headerName: 'Supplier Plant',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_COUNTRY,
    headerName: 'Supplier Country',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CO2_PER_TON,
    headerName: 'kg CO₂e / t',
    filter: 'agNumberColumnFilter',
    headerTooltip: CO2_PER_TON,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CO2_CLASSIFICATION,
    headerName: 'CO₂ Data Classification',
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: PRODUCT_CATEGORY,
    headerName: 'Product Category',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RELEASE_RESTRICTIONS,
    headerName: 'Release Restrictions',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: STATUS,
    headerName: 'Status',
    filterParams: FILTER_PARAMS,
    cellRenderer: StatusCellRendererComponent,
    valueGetter: STATUS_VALUE_GETTER,
  },
  {
    field: LAST_MODIFIED,
    headerName: 'Last Modified',
    filter: 'agDateColumnFilter',
    valueFormatter: CUSTOM_DATE_FORMATTER,
    sort: 'desc',
  },
];
