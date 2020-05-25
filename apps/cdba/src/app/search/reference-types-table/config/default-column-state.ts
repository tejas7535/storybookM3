import { ColumnState } from '../column-state';

export const DEFAULT_COLUMN_STATE: { [key: string]: ColumnState } = {
  materialNumber: {
    colId: 'materialNumber',
    pinned: 'left',
  },
  plant: {
    colId: 'plant',
  },
  materialDesignation: {
    colId: 'materialDesignation',
  },
  msd: {
    colId: 'msd',
  },
  productLine: {
    colId: 'productLine',
  },
  pcmQuantity: {
    colId: 'pcmQuantity',
  },
  width: {
    colId: 'width',
  },
};
