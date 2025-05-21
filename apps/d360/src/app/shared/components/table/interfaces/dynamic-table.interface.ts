import { BehaviorSubject, Observable } from 'rxjs';

import {
  CellClickedEvent,
  FirstDataRenderedEvent,
  GridReadyEvent,
} from 'ag-grid-enterprise';

import { TableConfig } from './table-config.interface';

/**
 * The Dynamic Table Interface.
 *
 * @export
 * @interface DynamicTable
 */
export interface DynamicTable {
  /**
   * The Table config.
   *
   * @type {TableConfig}
   * @memberof DynamicTable
   */
  table: TableConfig;

  /**
   * A wrapper class for the table to set e.g. the height.
   *
   * @type {string}
   * @memberof DynamicTable
   */
  tableClass?: string;

  /**
   * The loading indicator behavior subject.
   *
   * @type {(BehaviorSubject<boolean> | Observable<boolean>)}
   * @memberof DynamicTable
   */
  isLoading$?: BehaviorSubject<boolean> | Observable<boolean>;

  /**
   * Indicates whether to show a loader for infinite scroll.
   *
   * @type {boolean}
   * @memberof DynamicTable
   */
  showLoaderForInfiniteScroll?: boolean;

  /**
   * Has this table a toolbar?
   *
   * @type {boolean}
   * @memberof DynamicTable
   */
  hasToolbar?: boolean;

  /**
   * Has this table tabs for different layouts/views?
   *
   * @type {boolean}
   * @memberof DynamicTable
   */
  hasTabView?: boolean;

  /**
   * The table has a floating filter.
   *
   * @type {boolean}
   * @memberof DynamicTable
   */
  renderFloatingFilter?: boolean;

  /**
   * A custom onResetFilters function.
   *
   * @memberof DynamicTable
   */
  customOnResetFilters?: () => void;

  /**
   * A custom getFilterCount function.
   *
   * @memberof DynamicTable
   */
  customGetFilterCount?: () => number;

  /**
   * The maximum number of tabs allowed.
   *
   * @type {number}
   * @memberof DynamicTable
   */
  maxAllowedTabs?: number;

  /**
   * Some callbacks for the table.
   *
   * @type {AllowedCallbacks}
   * @memberof DynamicTable
   */
  callbacks?: AllowedCallbacks;
}

/**
 * Allowed callbacks for the table.
 *
 * @export
 * @interface AllowedCallbacks
 */
export interface AllowedCallbacks {
  onGridReady?: (event: GridReadyEvent) => void;
  onFirstDataRendered?: (event: FirstDataRenderedEvent) => void;
  onCellClicked?: (event: CellClickedEvent) => void;
}
