import { ICellRendererParams } from 'ag-grid-community';

export interface EditCellRendererParams extends ICellRendererParams {
  hasEditorRole?: boolean;
  editable?: boolean;
}
