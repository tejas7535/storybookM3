import { ColDef } from 'ag-grid-community';

import {
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
import { EditCellRendererComponent } from '@mac/msd/main-table/edit-cell-renderer/edit-cell-renderer.component';
import { StatusCellRendererComponent } from '@mac/msd/main-table/status-cell-renderer/status-cell-renderer.component';
import {
  CUSTOM_DATE_FORMATTER,
  DATE_COMPARATOR,
  FILTER_PARAMS,
  STATUS_VALUE_GETTER,
  TRANSLATE_VALUE_FORMATTER_FACTORY,
} from '@mac/msd/main-table/table-config';

import { HISTORY_COLUMN_DEFINITION } from './global-column-definitions';

export const BASE_COLUMN_DEFINITIONS: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
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
    valueFormatter: TRANSLATE_VALUE_FORMATTER_FACTORY(
      'materialsSupplierDatabase.mainTable.dialog.co2ClassificationValues',
      true
    ),
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
    filterParams: { comparator: DATE_COMPARATOR },
    sort: 'desc',
  },
];
