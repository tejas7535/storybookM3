import { ColumnState } from 'ag-grid-enterprise';

/**
 * the actionItemId is the value of the criteria the filter is applied to.
 * this could be the quotationId or activeTab name, or any other string value of the criteria to filter
 */
export interface FilterState {
  actionItemId: string;
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
  initialColIds: string[];
}
