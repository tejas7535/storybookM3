import { ColumnState } from 'ag-grid-community';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';

import { QuickFilter } from '../quickilter';

export interface ViewState {
  quickFilters: QuickFilter[];
  columnState: ColumnState[];
  active?: boolean;
}

export interface MsdAgGridStateV3 {
  version: number;
  materials: {
    [material in MaterialClass]?: {
      [NavigationLevel.MATERIAL]?: ViewState;
      [NavigationLevel.SUPPLIER]?: ViewState;
      [NavigationLevel.STANDARD]?: ViewState;
      [NavigationLevel.PRODUCT_CATEGORY_RULES]?: ViewState;
    };
  };
}

export interface MsdAgGridStateV2 {
  version: number;
  materials: {
    [material in MaterialClass]?: {
      [NavigationLevel.MATERIAL]?: ViewState;
      [NavigationLevel.SUPPLIER]?: ViewState;
      [NavigationLevel.STANDARD]?: ViewState;
    };
  };
}

export interface MsdAgGridStateV1 {
  version: number;
  materials: {
    [material in MaterialClass]?: ViewState;
  };
}

export type MsdAgGridStateLegacy = MsdAgGridStateV1 | MsdAgGridStateV2;
export type MsdAgGridStateCurrent = MsdAgGridStateV3;
export type MsdAgGridState =
  | MsdAgGridStateV1
  | MsdAgGridStateV2
  | MsdAgGridStateV3;
