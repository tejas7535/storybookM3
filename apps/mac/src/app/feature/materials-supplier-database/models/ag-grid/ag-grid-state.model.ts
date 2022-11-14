import { ColumnState } from 'ag-grid-community';

import { MaterialClass } from '@mac/msd/constants';

import { QuickFilter } from '../quickilter';

export interface MsdAgGridState {
  version: number;
  materials: {
    [material in MaterialClass]?: {
      quickFilters: QuickFilter[];
      columnState: ColumnState[];
    };
  };
}
