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
    headerName: 'Sector Key',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'sectorName',
    headerName: 'Sector Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'businessUnitKey',
    headerName: 'Business Unit Key',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'businessUnitName',
    headerName: 'Business Unit Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'productLineKey',
    headerName: 'Product Line Key',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'productLineName',
    headerName: 'Product Line Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'keyaccountKey',
    headerName: 'Key Account Key',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'keyaccountName',
    headerName: 'Key Account Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'socoCustomerNumberGlobalKey',
    headerName: 'Customer Number Global',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'socoCustomerNumberGlobalName',
    headerName: 'Customer Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'socoArticleNumberGlobalKey',
    headerName: 'Material Number Global',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'socoArticleNumberGlobalName',
    headerName: 'Material Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'productionPlantKey',
    headerName: 'Production Plant Key',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'productionPlantName',
    headerName: 'Production Plant Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'categoryNetSales',
    headerName: 'Net Sales Category',
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
];
