import { ColDef } from 'ag-grid-community';

import {
  ALLOCATION_TO_SIDE_PRODUCTS,
  FILENAME,
  LAST_MODIFIED,
  MODIFIED_BY,
  TITLE,
  VALID_UNTIL,
  VERSION,
} from '@mac/feature/materials-supplier-database/constants';

import { FILTER_PARAMS } from '../../filter-params';
import {
  CUSTOM_DATE_FORMATTER,
  YES_NO_VALUE_GETTER_FACTORY,
} from '../../helpers';
import { HISTORY_COLUMN_DEFINITION } from './global-column-definitions';

export const BASE_PRODUCT_CATEGORY_RULES_COLUMN_DEFINITION: ColDef[] = [
  HISTORY_COLUMN_DEFINITION,
  {
    field: TITLE,
    headerName: TITLE,
    filterParams: FILTER_PARAMS,
  },
  {
    field: FILENAME,
    headerName: FILENAME,
    filterParams: FILTER_PARAMS,
  },
  {
    field: ALLOCATION_TO_SIDE_PRODUCTS,
    headerName: ALLOCATION_TO_SIDE_PRODUCTS,
    filterParams: FILTER_PARAMS,
    valueGetter: YES_NO_VALUE_GETTER_FACTORY(ALLOCATION_TO_SIDE_PRODUCTS),
  },
  {
    field: LAST_MODIFIED,
    headerName: LAST_MODIFIED,
    filter: 'agDateColumnFilter',
    valueFormatter: CUSTOM_DATE_FORMATTER,
    sort: 'desc',
  },
  {
    field: VALID_UNTIL,
    headerName: VALID_UNTIL,
    filter: 'agDateColumnFilter',
    valueFormatter: CUSTOM_DATE_FORMATTER,
  },
  {
    field: VERSION,
    headerName: VERSION,
    filterParams: FILTER_PARAMS,
  },
  {
    field: MODIFIED_BY,
    headerName: MODIFIED_BY,
    filterParams: FILTER_PARAMS,
  },
];
