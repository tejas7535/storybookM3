import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-community';

import {
  CO2_CLASSIFICATION,
  CO2_PER_TON,
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  MANUFACTURER_SUPPLIER_REGION,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
  PRODUCT_CATEGORY,
  RECENT_STATUS,
  RELEASE_RESTRICTIONS,
  SAP_SUPPLIER_IDS,
} from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import {
  CUSTOM_DATE_FORMATTER,
  DATE_COMPARATOR,
  TRANSLATE_VALUE_FORMATTER_FACTORY,
} from '@mac/msd/main-table/table-config/helpers';

import { RecentStatusCellRendererComponent } from '../../../recent-status-cell-renderer/recent-status-cell-renderer.component';
import { HISTORY_COLUMN_DEFINITION } from './global-column-definitions';

export const BASE_COLUMN_DEFINITIONS: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
  {
    field: RECENT_STATUS,
    headerName: RECENT_STATUS,
    filterParams: FILTER_PARAMS,
    cellRenderer: RecentStatusCellRendererComponent,
    valueGetter: () => 1,
    headerValueGetter: () => '',
    cellClass: ['!pl-0', '!pr-2'],
    width: 50,
    pinned: 'left',
    lockPinned: true,
    lockVisible: true,
    lockPosition: true,
    resizable: false,
    suppressMovable: true,
    hide: false,
    suppressMenu: true,
    sortable: false,
    filter: false,
  },
  {
    field: MATERIAL_STANDARD_MATERIAL_NAME,
    headerName: MATERIAL_STANDARD_MATERIAL_NAME,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MATERIAL_STANDARD_STANDARD_DOCUMENT,
    headerName: MATERIAL_STANDARD_STANDARD_DOCUMENT,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_NAME,
    headerName: MANUFACTURER_SUPPLIER_NAME,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_PLANT,
    headerName: MANUFACTURER_SUPPLIER_PLANT,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_COUNTRY,
    headerName: MANUFACTURER_SUPPLIER_COUNTRY,
    filterParams: FILTER_PARAMS,
    filterValueGetter: (params) =>
      `${translate(
        `materialsSupplierDatabase.mainTable.tooltip.country.${params.data['manufacturerSupplierCountry']}`
      )} (${params.data['manufacturerSupplierCountry']})`,
    cellRenderer: EditCellRendererComponent,
    tooltipValueGetter: (params) => `country.${params.value}`,
  },
  {
    field: MANUFACTURER_SUPPLIER_REGION,
    headerName: MANUFACTURER_SUPPLIER_REGION,
    filterParams: FILTER_PARAMS,
    filterValueGetter: (params) =>
      `${translate(
        `materialsSupplierDatabase.mainTable.tooltip.region.${params.data['manufacturerSupplierRegion']}`
      )} (${params.data['manufacturerSupplierRegion']})`,
    cellRenderer: EditCellRendererComponent,
    tooltipValueGetter: (params) => `region.${params.value}`,
  },
  {
    field: CO2_PER_TON,
    headerName: CO2_PER_TON,
    filter: 'agNumberColumnFilter',
    headerTooltip: CO2_PER_TON,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CO2_CLASSIFICATION,
    headerName: CO2_CLASSIFICATION,
    hide: true,
    cellRenderer: EditCellRendererComponent,
    valueFormatter: TRANSLATE_VALUE_FORMATTER_FACTORY(
      'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues',
      true
    ),
  },
  {
    field: PRODUCT_CATEGORY,
    headerName: PRODUCT_CATEGORY,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RELEASE_RESTRICTIONS,
    headerName: RELEASE_RESTRICTIONS,
    filterParams: FILTER_PARAMS,
    hide: false,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: SAP_SUPPLIER_IDS,
    headerName: SAP_SUPPLIER_IDS,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
    hide: true,
  },
  {
    field: LAST_MODIFIED,
    headerName: LAST_MODIFIED,
    filter: 'agDateColumnFilter',
    valueFormatter: CUSTOM_DATE_FORMATTER,
    filterParams: { comparator: DATE_COMPARATOR },
    sort: 'desc',
  },
];
