import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-community';

import {
  BUSINESS_PARTNER_ID,
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_BUSINESSPARTNERID,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  MANUFACTURER_SUPPLIER_REGION,
  MANUFACTURER_SUPPLIER_SAPID,
  RECENT_STATUS,
} from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import { CUSTOM_DATE_FORMATTER } from '@mac/msd/main-table/table-config/helpers';

import { RecentStatusCellRendererComponent } from '../../../recent-status-cell-renderer/recent-status-cell-renderer.component';
import { HISTORY_COLUMN_DEFINITION } from './global-column-definitions';

export const BASE_SUPPLIERS_COLUMN_DEFINITIONS: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
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
    field: MANUFACTURER_SUPPLIER_SAPID,
    headerName: MANUFACTURER_SUPPLIER_SAPID,
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: MANUFACTURER_SUPPLIER_BUSINESSPARTNERID,
    headerName: BUSINESS_PARTNER_ID,
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
    hide: true,
  },
  {
    field: RECENT_STATUS,
    headerName: RECENT_STATUS,
    filterParams: FILTER_PARAMS,
    cellRenderer: RecentStatusCellRendererComponent,
    valueGetter: () => 1,
    headerValueGetter: () => '',
    cellClass: ['!pl-0', '!pr-2'],
    width: 60,
    pinned: 'left',
    lockPinned: true,
    lockVisible: true,
    lockPosition: true,
    resizable: true,
    suppressMovable: true,
    hide: false,
    suppressMenu: true,
    sortable: false,
    filter: false,
  },
  {
    field: LAST_MODIFIED,
    headerName: LAST_MODIFIED,
    filter: 'agDateColumnFilter',
    valueFormatter: CUSTOM_DATE_FORMATTER,
    sort: 'desc',
  },
];
