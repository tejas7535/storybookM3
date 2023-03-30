import { ICellRendererParams } from 'ag-grid-community';

export type FreeStockCellParams = ICellRendererParams & {
  uom: string;
};
