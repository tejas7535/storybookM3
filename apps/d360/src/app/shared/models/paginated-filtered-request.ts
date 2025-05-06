import { SortModelItem } from 'ag-grid-enterprise';

import { ColumnFilters } from '../ag-grid/grid-filter-model';

export interface PaginatedFilteredRequest {
  startRow: number;
  endRow: number;
  sortModel: SortModelItem[];
  columnFilters: ColumnFilters;
  selectionFilters: Record<string, any>;
}

export interface PaginatedFilteredResponse<T> {
  rowCount: number;
  rows: T[];
}
