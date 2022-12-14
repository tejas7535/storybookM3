import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import {
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  SAP_SUPPLIER_IDS,
  STATUS,
} from '@mac/msd/constants';

export const POLYMER_SUPPLIERS_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'default',
    filter: {},
    columns: [
      MANUFACTURER_SUPPLIER_NAME,
      MANUFACTURER_SUPPLIER_PLANT,
      MANUFACTURER_SUPPLIER_COUNTRY,
      SAP_SUPPLIER_IDS,
      STATUS,
      LAST_MODIFIED,
    ],
    custom: false,
  },
];
