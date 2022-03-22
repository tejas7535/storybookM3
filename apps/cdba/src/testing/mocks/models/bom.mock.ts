import { BomItem } from '@cdba/shared/models';

import { BOM_ITEM_CLASSIC_MOCK } from './bom-classic.mock';
import { BOM_ITEM_ODATA_MOCK } from './bom-odata.mock';

const BOM_ITEM_MOCK: BomItem = {
  ...BOM_ITEM_ODATA_MOCK,
  ...BOM_ITEM_CLASSIC_MOCK,
};

export const BOM_MOCK: BomItem[] = [
  { ...BOM_ITEM_MOCK },
  {
    ...BOM_ITEM_MOCK,
    level: 2,
    rowId: 2,
    materialDesignation: 'FE-2315',
    predecessorsInTree: ['FE-2313', 'FE-2315'],
    costShareOfParent: 1,
  },
  { ...BOM_ITEM_MOCK, level: 2, rowId: 3, materialDesignation: 'FE-2315' },
  { ...BOM_ITEM_MOCK, level: 3, rowId: 4, materialDesignation: 'FE-2314' },
  { ...BOM_ITEM_MOCK, level: 2, rowId: 5, materialDesignation: 'FE-2311' },
];
