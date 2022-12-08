import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { QuickFilter } from '@mac/msd/models';

import {
  ALUMINUM_MATERIAL_STANDARDS_STATIC_QUICKFILTERS,
  ALUMINUM_STATIC_QUICKFILTERS,
  ALUMINUM_SUPPLIERS_STATIC_QUICKFILTERS,
} from './aluminum';
import {
  POLYMER_MATERIAL_STANDARDS_STATIC_QUICKFILTERS,
  POLYMER_STATIC_QUICKFILTERS,
  POLYMER_SUPPLIERS_STATIC_QUICKFILTERS,
} from './polymer';
import {
  STEEL_MATERIAL_STANDARDS_STATIC_QUICKFILTERS,
  STEEL_STATIC_QUICKFILTERS,
  STEEL_SUPPLIERS_STATIC_QUICKFILTERS,
} from './steel';

export interface MsdStaticQuickFiltersMapping {
  materials: {
    [material in MaterialClass]: {
      [navigationLevel in NavigationLevel]?: QuickFilter[];
    };
  };
}

export const STATIC_QUICKFILTERS_MAPPING: MsdStaticQuickFiltersMapping = {
  materials: {
    [MaterialClass.STEEL]: {
      [NavigationLevel.MATERIAL]: STEEL_STATIC_QUICKFILTERS,
      [NavigationLevel.SUPPLIER]: STEEL_SUPPLIERS_STATIC_QUICKFILTERS,
      [NavigationLevel.STANDARD]: STEEL_MATERIAL_STANDARDS_STATIC_QUICKFILTERS,
    },
    [MaterialClass.ALUMINUM]: {
      [NavigationLevel.MATERIAL]: ALUMINUM_STATIC_QUICKFILTERS,
      [NavigationLevel.SUPPLIER]: ALUMINUM_SUPPLIERS_STATIC_QUICKFILTERS,
      [NavigationLevel.STANDARD]:
        ALUMINUM_MATERIAL_STANDARDS_STATIC_QUICKFILTERS,
    },
    [MaterialClass.POLYMER]: {
      [NavigationLevel.MATERIAL]: POLYMER_STATIC_QUICKFILTERS,
      [NavigationLevel.SUPPLIER]: POLYMER_SUPPLIERS_STATIC_QUICKFILTERS,
      [NavigationLevel.STANDARD]:
        POLYMER_MATERIAL_STANDARDS_STATIC_QUICKFILTERS,
    },
  },
};
