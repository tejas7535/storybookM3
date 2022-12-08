import { ColumnState } from 'ag-grid-community';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';

import { QuickFilter } from '../quickilter';

export interface ViewState {
  quickFilters: QuickFilter[];
  columnState: ColumnState[];
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

export type MsdAgGridStateLegacy = MsdAgGridStateV1;
export type MsdAgGridStateCurrent = MsdAgGridStateV2;
export type MsdAgGridState = MsdAgGridStateV1 | MsdAgGridStateV2;
