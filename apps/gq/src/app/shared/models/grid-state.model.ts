import { ColumnState } from 'ag-grid-community';

export interface FilterState {
  quotationId: string;
  filterModels: Record<string, any>;
}

export interface ViewState {
  columnState: ColumnState[];
  filterState: FilterState[];
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
