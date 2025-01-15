import { ICellRendererParams } from 'ag-grid-enterprise';

export type FreeStockCellParams = ICellRendererParams & {
  uom: string;
};
