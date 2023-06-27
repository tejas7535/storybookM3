import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import {
  CO2_PER_TON,
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  MANUFACTURER_SUPPLIER_REGION,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
  PRODUCT_CATEGORY,
  RELEASE_RESTRICTIONS,
} from '@mac/msd/constants';

export const ALUMINUM_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'default',
    filter: {},
    columns: [
      MATERIAL_STANDARD_MATERIAL_NAME,
      MATERIAL_STANDARD_STANDARD_DOCUMENT,
      MANUFACTURER_SUPPLIER_NAME,
      MANUFACTURER_SUPPLIER_PLANT,
      MANUFACTURER_SUPPLIER_COUNTRY,
      MANUFACTURER_SUPPLIER_REGION,
      RELEASE_RESTRICTIONS,
      PRODUCT_CATEGORY,
      LAST_MODIFIED,
      CO2_PER_TON,
    ],
    custom: false,
  },
  {
    title: 'co2',
    filter: {
      [CO2_PER_TON]: {
        filterType: 'number',
        type: 'greaterThan',
        filter: 0,
      },
    },
    columns: [
      MATERIAL_STANDARD_MATERIAL_NAME,
      MATERIAL_STANDARD_STANDARD_DOCUMENT,
      MANUFACTURER_SUPPLIER_NAME,
      MANUFACTURER_SUPPLIER_PLANT,
      CO2_PER_TON,
      PRODUCT_CATEGORY,
      LAST_MODIFIED,
    ],
    custom: false,
  },
];
