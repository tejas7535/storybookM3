import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import {
  CASTING_DIAMETER,
  CASTING_MODE,
  CO2_CLASSIFICATION,
  CO2_PER_TON,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
  MAX_DIMENSION,
  PRODUCT_CATEGORY,
  RATING,
  RATING_REMARK,
  RELEASE_RESTRICTIONS,
  STEEL_MAKING_PROCESS,
} from '@mac/msd/constants';

export const STEEL_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'default',
    filter: {},
    columns: [
      PRODUCT_CATEGORY,
      MATERIAL_STANDARD_MATERIAL_NAME,
      MATERIAL_STANDARD_STANDARD_DOCUMENT,
      MANUFACTURER_SUPPLIER_NAME,
      MANUFACTURER_SUPPLIER_PLANT,
      CASTING_MODE,
      CASTING_DIAMETER,
      MAX_DIMENSION,
      RELEASE_RESTRICTIONS,
    ],
    custom: false,
  },
  {
    title: 'rating',
    filter: {
      [RATING]: {
        values: ['RSI', 'RSII', 'RSIII'],
        filterType: 'set',
      },
    },
    columns: [
      PRODUCT_CATEGORY,
      MATERIAL_STANDARD_MATERIAL_NAME,
      MATERIAL_STANDARD_STANDARD_DOCUMENT,
      MANUFACTURER_SUPPLIER_NAME,
      MANUFACTURER_SUPPLIER_PLANT,
      CASTING_MODE,
      CASTING_DIAMETER,
      MAX_DIMENSION,
      RELEASE_RESTRICTIONS,
      RATING,
      RATING_REMARK,
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
      PRODUCT_CATEGORY,
      MATERIAL_STANDARD_MATERIAL_NAME,
      MATERIAL_STANDARD_STANDARD_DOCUMENT,
      MANUFACTURER_SUPPLIER_NAME,
      MANUFACTURER_SUPPLIER_PLANT,
      CASTING_MODE,
      CASTING_DIAMETER,
      MAX_DIMENSION,
      RELEASE_RESTRICTIONS,
      STEEL_MAKING_PROCESS,
      CO2_PER_TON,
      CO2_CLASSIFICATION,
    ],
    custom: false,
  },
];
