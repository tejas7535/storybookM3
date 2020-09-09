// This interface is acutally part of the private API of AG Grid
export interface ColumnState {
  colId: string;
  hide?: boolean;
  aggFunc?: string | Function | null;
  width?: number;
  pivotIndex?: number | null;
  pinned?: boolean | string | 'left' | 'right';
  rowGroupIndex?: number | null;
  flex?: number;
}
