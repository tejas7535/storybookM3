import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import { LAST_MODIFIED, MANUFACTURER_SUPPLIER_NAME } from '@mac/msd/constants';

export const LUBRICANT_SUPPLIERS_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'default',
    filter: {},
    columns: [MANUFACTURER_SUPPLIER_NAME, LAST_MODIFIED],
    custom: false,
  },
];
