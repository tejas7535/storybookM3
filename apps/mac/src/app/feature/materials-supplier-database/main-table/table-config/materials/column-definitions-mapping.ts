import { ColDef } from 'ag-grid-community';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';

import {
  ALUMINUM_COLUMN_DEFINITIONS,
  ALUMINUM_MATERIAL_STANDARDS_COLUMN_DEFINITIONS,
  ALUMINUM_SUPPLIERS_COLUMN_DEFINITIONS,
} from './aluminum';
import {
  POLYMER_COLUMN_DEFINITIONS,
  POLYMER_MATERIAL_STANDARDS_COLUMN_DEFINITIONS,
  POLYMER_SUPPLIERS_COLUMN_DEFINITIONS,
} from './polymer';
import {
  STEEL_COLUMN_DEFINITIONS,
  STEEL_MATERIAL_STANDARDS_COLUMN_DEFINITIONS,
  STEEL_SUPPLIERS_COLUMN_DEFINITIONS,
} from './steel';

export interface MsdColumnDefinitionsMapping {
  materials: {
    [material in MaterialClass]: {
      [navigationLevel in NavigationLevel]?: ColDef[];
    };
  };
}

export const COLUMN_DEFINITIONS_MAPPING: MsdColumnDefinitionsMapping = {
  materials: {
    [MaterialClass.STEEL]: {
      [NavigationLevel.MATERIAL]: STEEL_COLUMN_DEFINITIONS,
      [NavigationLevel.SUPPLIER]: STEEL_SUPPLIERS_COLUMN_DEFINITIONS,
      [NavigationLevel.STANDARD]: STEEL_MATERIAL_STANDARDS_COLUMN_DEFINITIONS,
    },
    [MaterialClass.ALUMINUM]: {
      [NavigationLevel.MATERIAL]: ALUMINUM_COLUMN_DEFINITIONS,
      [NavigationLevel.SUPPLIER]: ALUMINUM_SUPPLIERS_COLUMN_DEFINITIONS,
      [NavigationLevel.STANDARD]:
        ALUMINUM_MATERIAL_STANDARDS_COLUMN_DEFINITIONS,
    },
    [MaterialClass.POLYMER]: {
      [NavigationLevel.MATERIAL]: POLYMER_COLUMN_DEFINITIONS,
      [NavigationLevel.SUPPLIER]: POLYMER_SUPPLIERS_COLUMN_DEFINITIONS,
      [NavigationLevel.STANDARD]: POLYMER_MATERIAL_STANDARDS_COLUMN_DEFINITIONS,
    },
  },
};
