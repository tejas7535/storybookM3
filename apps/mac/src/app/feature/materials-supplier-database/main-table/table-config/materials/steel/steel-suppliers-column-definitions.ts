import { ColDef } from 'ag-grid-community';

import { SAP_SUPPLIER_IDS } from '@mac/feature/materials-supplier-database/constants';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config';
import { BASE_SUPPLIERS_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

export const STEEL_SUPPLIERS_COLUMN_DEFINITIONS: ColDef[] = [
  ...BASE_SUPPLIERS_COLUMN_DEFINITIONS,
  {
    field: SAP_SUPPLIER_IDS,
    headerName: 'SAP Supplier ID(s)',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
];
