import { SortModelItem } from 'ag-grid-enterprise';

import { ColumnFilters } from '../../../ag-grid/grid-filter-model';

/**
 * The RequestParams Interface.
 *
 * @export
 * @interface RequestParams
 */
export interface RequestParams {
  startRow: number | undefined;
  endRow: number | undefined;
  sortModel: SortModelItem[];
  columnFilters: ColumnFilters[];
  groupKeys: string[];
}

/**
 * The BackendTableResponse Interface.
 *
 * @export
 * @interface BackendTableResponse
 */
export interface BackendTableResponse<T = any> {
  rowCount: number;
  rows: T[];
  [key: string]: any;
}

/**
 * The FrontendTableResponse Interface.
 *
 * @export
 * @interface FrontendTableResponse
 */
export interface FrontendTableResponse<T = any> {
  content: T[];
  [key: string]: any;
}
