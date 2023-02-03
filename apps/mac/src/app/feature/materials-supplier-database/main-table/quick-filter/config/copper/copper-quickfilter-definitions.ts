import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import {
  CASTING_DIAMETER,
  CASTING_MODE,
  CO2_PER_TON,
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
  MAX_DIMENSION,
  PRODUCT_CATEGORY,
  PRODUCTION_PROCESS,
  RATING,
  RELEASE_RESTRICTIONS,
  STATUS,
} from '@mac/msd/constants';

export const COPPER_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'default',
    filter: {},
    columns: [
      MATERIAL_STANDARD_MATERIAL_NAME,
      MATERIAL_STANDARD_STANDARD_DOCUMENT,
      MANUFACTURER_SUPPLIER_NAME,
      MANUFACTURER_SUPPLIER_PLANT,
      CASTING_MODE,
      CASTING_DIAMETER,
      MAX_DIMENSION,
      RATING,
      RELEASE_RESTRICTIONS,
      PRODUCT_CATEGORY,
      STATUS,
      LAST_MODIFIED,
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
      CASTING_MODE,
      CASTING_DIAMETER,
      PRODUCTION_PROCESS,
      CO2_PER_TON,
      PRODUCT_CATEGORY,
      STATUS,
      LAST_MODIFIED,
    ],
    custom: false,
  },
];
