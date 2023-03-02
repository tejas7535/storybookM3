import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import {
  LAST_MODIFIED,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
} from '@mac/msd/constants';

export const ALUMINUM_MATERIAL_STANDARDS_STATIC_QUICKFILTERS: QuickFilter[] = [
  {
    title: 'default',
    filter: {},
    columns: [
      MATERIAL_STANDARD_MATERIAL_NAME,
      MATERIAL_STANDARD_STANDARD_DOCUMENT,
      LAST_MODIFIED,
    ],
    custom: false,
  },
];
