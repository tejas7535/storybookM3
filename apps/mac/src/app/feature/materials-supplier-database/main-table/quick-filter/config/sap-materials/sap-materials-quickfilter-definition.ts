import {
  DATA_SOURCE_ID,
  EMISSION_FACTOR_KG,
  MATERIAL_GROUP,
  MATERIAL_NUMBER,
  OWNER,
  SUPPLIER_ID,
} from '@mac/msd/constants';
import { QuickFilter } from '@mac/msd/models';

export const SAP_MATERIALS_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'default',
    filter: {},
    columns: [
      MATERIAL_NUMBER,
      MATERIAL_GROUP,
      SUPPLIER_ID,
      EMISSION_FACTOR_KG,
      DATA_SOURCE_ID,
      OWNER,
    ],
    custom: false,
  },
];
