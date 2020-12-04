import { ColDef } from '@ag-grid-community/all-modules';

import { FILTER_PARAMS } from './filter-params';

export const dateFormatter = (data: any): string => {
  return data.value ? new Date(data.value).toLocaleDateString() : '';
};

export const COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: 'combinedKey',
    headerName: 'Combined Key',
    filterParams: FILTER_PARAMS,
    cellRenderer: 'agGroupCellRenderer',
  },
  {
    field: 'sectorKey',
    headerName: 'Branch Key',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'sectorName',
    headerName: 'Branch Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'keyaccountName',
    headerName: 'Key Account',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'socoCustomerNumberGlobalKey',
    headerName: 'Customer Key',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'socoCustomerNumberGlobalName',
    headerName: 'Customer Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'socoArticleNumberGlobalKey',
    headerName: 'Part Number',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'socoArticleNumberGlobalName',
    headerName: 'Short Text',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'productionPlantKey',
    headerName: 'Production Plant',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'categoryNetSales',
    headerName: 'Category',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'lastModifier',
    headerName: 'Last SOCO Planner',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'eopDateVerified',
    headerName: 'EOP',
    filter: 'agDateColumnFilter',
    valueFormatter: dateFormatter,
    filterParams: {
      ...FILTER_PARAMS,
      filterOptions: ['equals', 'inRange'],
    },
  },
  {
    field: 'edoDate',
    headerName: 'EDO',
    filter: 'agDateColumnFilter',
    valueFormatter: dateFormatter,
    filterParams: {
      ...FILTER_PARAMS,
      filterOptions: ['equals', 'inRange'],
    },
  },
  {
    field: 'lastUpdated',
    headerName: 'Last Modified',
    filter: 'agDateColumnFilter',
    valueFormatter: dateFormatter,
    filterParams: {
      ...FILTER_PARAMS,
      filterOptions: ['equals', 'inRange'],
    },
  },
];
