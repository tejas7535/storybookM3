import {
  EMISSION_FACTOR_KG,
  MATERIAL_GROUP,
  MATERIAL_NUMBER,
  MATURITY,
  OWNER,
  SUPPLIER_ID,
} from '@mac/msd/constants';
import { QuickFilter } from '@mac/msd/models';

export const SAP_MATERIALS_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'All view',
    filter: {},
    columns: [
      MATERIAL_NUMBER,
      MATERIAL_GROUP,
      SUPPLIER_ID,
      EMISSION_FACTOR_KG,
      MATURITY,
      OWNER,
    ],
  },
];
