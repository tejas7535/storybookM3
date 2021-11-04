import { CellClassParams } from '@ag-grid-community/all-modules';

import { EditCellData } from './edit-cell-class-params.model';

export type ExtendedCellClassParams = CellClassParams & {
  valueFormatted: string;
};

export type ExtendedEditCellClassParams = ExtendedCellClassParams &
  EditCellData;
