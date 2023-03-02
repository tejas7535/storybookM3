import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import {
  GRADE,
  LAST_MODIFIED,
  MATERIAL_STANDARD_MATERIAL_NAME,
} from '@mac/msd/constants';

export const HARDMAGNET_MATERIAL_STANDARDS_STATIC_QUICKFILTERS: QuickFilter[] =
  [
    {
      title: 'default',
      filter: {},
      columns: [MATERIAL_STANDARD_MATERIAL_NAME, GRADE, LAST_MODIFIED],
      custom: false,
    },
  ];
