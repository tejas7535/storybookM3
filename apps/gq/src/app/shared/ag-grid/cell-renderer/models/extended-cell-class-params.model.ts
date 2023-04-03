import { CellClassParams, ICellRendererParams } from 'ag-grid-community';

import { EditCellData } from './edit-cell-class-params.model';

type ExtendedCellClassParams = CellClassParams & {
  valueFormatted: string;
};

export type ExtendedEditCellClassParams = ICellRendererParams &
  ExtendedCellClassParams &
  EditCellData;
