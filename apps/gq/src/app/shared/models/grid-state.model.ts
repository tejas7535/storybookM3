import { ColumnState } from 'ag-grid-community';

export interface ViewState {
  columnState: ColumnState[];
}

export interface CustomView {
  id: number;
  title: string;
  state: ViewState;
}
export interface GridState {
  version: number;
  customViews: CustomView[];
}
