import { ColDef } from 'ag-grid-enterprise';

import { IGNORE_FLAG_DESCRIPTIONS } from '../constants/ignore-flag-descriptions.const';
import { FILTER_PARAMS } from './filter-params';

export const dateFormatter = (data: any): string =>
  data.value ? new Date(data.value).toLocaleDateString() : '';

export const warningFormatter = (data: any): string =>
  data.value === 'true' ? 'Warning' : 'No Warning';

export const ignoreFlagFormatter = (data: any): string =>
  IGNORE_FLAG_DESCRIPTIONS[data.value]
    ? IGNORE_FLAG_DESCRIPTIONS[data.value]
    : `No ignore flag description for ${data.value}`;

export const dateComparator = (
  filterDate: Date,
  columnDateString: string
): number => {
  if (columnDateString === null || columnDateString === undefined) {
    return 0;
  }

  const filterDateTimestamp = filterDate.getTime();

  const columnDate = new Date(columnDateString);
  columnDate.setHours(0, 0, 0, 0);
  const columnDateTimestamp = new Date(columnDate).getTime();

  if (filterDateTimestamp === columnDateTimestamp) {
    return 0;
  } else if (filterDateTimestamp < columnDateTimestamp) {
    return 1;
  } else {
    return -1;
  }
};

export const COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: 'combinedKey',
    headerName: 'Combined Key',
    filterParams: FILTER_PARAMS,
    cellRenderer: 'agGroupCellRenderer',
  },
  {
    field: 'timeoutWarning',
    headerName: 'Warnings',
    filterParams: {
      ...FILTER_PARAMS,
      valueFormatter: warningFormatter,
    },
    cellRenderer: 'warningsCellrenderer',
    cellStyle: {
      display: 'flex ',
      'justify-content': 'center',
    },
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
      comparator: dateComparator,
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
      comparator: dateComparator,
    },
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
    field: 'salesorgKey',
    headerName: 'Sales Organization Key',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'salesorgName',
    headerName: 'Sales Organization Name',
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
    field: 'plantKeysList',
    headerName: 'Product Plant Key(s)',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'plantNamesList',
    headerName: 'Product Plant Name(s)',
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
    field: 'ignoreFlag',
    headerName: 'Ignore flag',
    valueFormatter: ignoreFlagFormatter,
    filterParams: {
      ...FILTER_PARAMS,
      valueFormatter: ignoreFlagFormatter,
    },
  },
  {
    field: 'categoryNetSales',
    headerName: 'Net Sales Category',
    filterParams: FILTER_PARAMS,
  },
];
