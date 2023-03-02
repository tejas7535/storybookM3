import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import {
  LAST_MODIFIED,
  MANUFACTURER,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
} from '@mac/msd/constants';

export const CERAMIC_SUPPLIERS_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'default',
    filter: {},
    columns: [
      MANUFACTURER_SUPPLIER_NAME,
      MANUFACTURER_SUPPLIER_PLANT,
      MANUFACTURER_SUPPLIER_COUNTRY,
      MANUFACTURER,
      LAST_MODIFIED,
    ],
    custom: false,
  },
];
