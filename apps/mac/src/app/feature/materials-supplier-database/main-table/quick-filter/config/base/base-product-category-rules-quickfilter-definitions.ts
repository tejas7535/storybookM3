import {
  ALLOCATION_TO_SIDE_PRODUCTS,
  FILENAME,
  LAST_MODIFIED,
  MODIFIED_BY,
  TITLE,
  VALID_UNTIL,
  VERSION,
} from '@mac/feature/materials-supplier-database/constants';
import { QuickFilter } from '@mac/feature/materials-supplier-database/models';

export const BASE_PRODUCT_CATEGORY_RULES_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'All view',
    filter: {},
    columns: [
      TITLE,
      FILENAME,
      ALLOCATION_TO_SIDE_PRODUCTS,
      LAST_MODIFIED,
      VALID_UNTIL,
      VERSION,
      MODIFIED_BY,
    ],
  },
];
