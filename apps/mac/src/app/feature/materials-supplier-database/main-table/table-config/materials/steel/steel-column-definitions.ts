import { ColDef } from 'ag-grid-enterprise';

import {
  CASTING_DIAMETER,
  CASTING_MODE,
  CO2_PER_TON,
  MANUFACTURER,
  MANUFACTURER_SUPPLIER_SELFCERTIFIED,
  MATERIAL_NUMBERS,
  MAX_DIMENSION,
  MIN_DIMENSION,
  RATING,
  RATING_REMARK,
  RECENT_STATUS,
  RECYCLING_RATE,
  RELEASE_DATE,
  RELEASED_STATUS,
  STEEL_MAKING_PROCESS,
} from '@mac/msd/constants';
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import {
  MANUFACTURER_VALUE_GETTER,
  RECYCLING_RATE_FILTER_VALUE_GETTER,
  RECYCLING_RATE_VALUE_GETTER,
  RELEASE_DATE_FORMATTER,
  RELEASE_DATE_VALUE_GETTER,
  STATUS_VALUE_GETTER,
  TRANSLATE_VALUE_FORMATTER_FACTORY,
} from '@mac/msd/main-table/table-config/helpers';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

import { GreenSteelCellRendererComponent } from '../../../green-steel-cell-renderer/green-steel-cell-renderer.component';
import { ReleaseStatusCellRendererComponent } from '../../../release-status-cell-renderer/release-status-cell-renderer.component';

const exclude = (columns: string[], colDef: ColDef[]): ColDef[] =>
  colDef.filter((cd) => !columns.includes(cd.field));

export const STEEL_COLUMN_DEFINITIONS: ColDef[] = [
  // 'recentStatus' is replaced by 'releasedStatus'
  ...exclude([RECENT_STATUS, CO2_PER_TON], BASE_COLUMN_DEFINITIONS),
  {
    field: RELEASED_STATUS,
    headerName: RELEASED_STATUS,
    filterParams: FILTER_PARAMS,
    cellRenderer: ReleaseStatusCellRendererComponent,
    valueGetter: STATUS_VALUE_GETTER,
    cellClass: ['!pl-0', '!pr-2'],
    headerClass: ['!-ml-12', '!w-[123px]'],
    width: 75,
    pinned: 'left',
    lockPinned: true,
    lockVisible: true,
    lockPosition: true,
    resizable: false,
    suppressMovable: true,
    hide: false,
    suppressMenu: true,
  },
  {
    field: CO2_PER_TON,
    headerName: CO2_PER_TON,
    filter: 'agNumberColumnFilter',
    headerTooltip: CO2_PER_TON,
    width: 140,
    cellRenderer: GreenSteelCellRendererComponent,
  },
  {
    field: MATERIAL_NUMBERS,
    headerName: 'steelNumber',
    headerTooltip: 'steelNumber',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER,
    headerName: MANUFACTURER,
    hide: true,
    cellRenderer: EditCellRendererComponent,
    valueGetter: MANUFACTURER_VALUE_GETTER,
  },
  {
    field: MIN_DIMENSION,
    headerName: MIN_DIMENSION,
    filter: 'agNumberColumnFilter',
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MAX_DIMENSION,
    headerName: MAX_DIMENSION,
    filter: 'agNumberColumnFilter',
    headerTooltip: MAX_DIMENSION,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RATING,
    headerName: RATING,
    filterParams: FILTER_PARAMS,
    headerTooltip: RATING,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RATING_REMARK,
    headerName: RATING_REMARK,
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CASTING_MODE,
    headerName: CASTING_MODE,
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: CASTING_MODE,
    cellRenderer: EditCellRendererComponent,
    valueFormatter: TRANSLATE_VALUE_FORMATTER_FACTORY(
      'materialsSupplierDatabase.mainTable.dialog',
      true
    ),
  },
  {
    field: CASTING_DIAMETER,
    headerName: CASTING_DIAMETER,
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: CASTING_DIAMETER,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: STEEL_MAKING_PROCESS,
    headerName: STEEL_MAKING_PROCESS,
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: STEEL_MAKING_PROCESS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RECYCLING_RATE,
    headerName: RECYCLING_RATE,
    filter: 'agNumberColumnFilter',
    filterValueGetter: RECYCLING_RATE_FILTER_VALUE_GETTER,
    valueGetter: RECYCLING_RATE_VALUE_GETTER,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RELEASE_DATE,
    headerName: RELEASE_DATE,
    cellRenderer: EditCellRendererComponent,
    valueFormatter: RELEASE_DATE_FORMATTER,
    valueGetter: RELEASE_DATE_VALUE_GETTER,
    headerTooltip: RELEASE_DATE,
    filter: 'agDateColumnFilter',
  },
  {
    field: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
    headerName: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
    hide: true,
    headerTooltip: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
  },
];
