import {
  CellDoubleClickedEvent,
  CellKeyDownEvent,
  ColDef,
  GetRowIdFunc,
  GetServerSideGroupKey,
  GridApi,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
  RowClassParams,
  RowClassRules,
  RowStyle,
  SideBarDef,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-enterprise';

/**
 * The Table Config Interface.
 * Most of the properties are ag-grid defaults, so please check ag-grid docs
 *
 * @see https://www.ag-grid.com/javascript-data-grid/getting-started/
 *
 * @export
 * @interface TableConfig
 */
export interface TableConfig {
  /**
   * The table columns definitions.
   *
   * @type {(ExtendedColumnDefs[] | NamedColumnDefs[])}
   * @memberof TableConfig
   */
  columnDefs: ExtendedColumnDefs[] | NamedColumnDefs[];

  /**
   * The table initial/default columns definitions.
   *
   * @type {NamedColumnDefs[]}
   * @memberof TableConfig
   */
  initialColumnDefs?: NamedColumnDefs[];

  /**
   * This is the table id of this table. Used to identify the tab layouts
   *
   * @type {string}
   * @memberof TableConfig
   */
  tableId: string;

  /**
   * The columns autoSize strategy.
   *
   * - Leave it empty (undefined) to only call one time autoSizeAllColumns
   * - Set it to false to not call one time autoSizeAllColumns
   * - Set it to one of the strategies to use this strategy
   *
   * @type {(SizeColumnsToFitGridStrategy
   *     | SizeColumnsToFitProvidedWidthStrategy
   *     | SizeColumnsToContentStrategy
   *     | false)}
   * @memberof TableConfig
   */
  autoSizeStrategy?:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
    | false;

  /**
   * The table themeClass e.g. material.
   *
   * @type {string}
   * @memberof TableConfig
   */
  themeClass?: string;

  /**
   * An additional function to set row styles.
   *
   * @memberof TableConfig
   */
  getRowStyle?: (params: RowClassParams) => RowStyle | undefined;

  /**
   * Rules which can be applied to include certain CSS classes.
   *
   * @type {RowClassRules}
   * @memberof TableConfig
   */
  rowClassRules?: RowClassRules;

  /**
   * The table context object to pass additional data.
   *
   * @type {Record<string, any>}
   * @memberof TableConfig
   */
  context?: Record<string, any>;

  /**
   * The table gridApi instance.
   *
   * @type {GridApi}
   * @memberof TableConfig
   */
  gridApi?: GridApi;

  /**
   * The table default column definitions.
   *
   * @type {ColDef}
   * @memberof TableConfig
   */
  defaultColDef?: ColDef;

  /**
   * The table loading message.
   *
   * @type {string}
   * @memberof TableConfig
   */
  loadingMessage?: string;

  /**
   * The table noRows message.
   *
   * @type {string}
   * @memberof TableConfig
   */
  noRowsMessage?: string;

  /**
   * The function to get a unique row id.
   *
   * @type {GetRowIdFunc}
   * @memberof TableConfig
   */
  getRowId?: GetRowIdFunc;

  /**
   * The options for server side auto groups.
   *
   * @type {ServerSideAutoGroupProps}
   * @memberof TableConfig
   */
  serverSideAutoGroup?: ServerSideAutoGroupProps;

  /**
   * The options for custom tree data and groups.
   *
   * @type {CustomTreeData}
   * @memberof TableConfig
   */
  customTreeData?: CustomTreeData;

  /**
   * The side bar options.
   * Hint: If this property is set, the table adds / removes the tool panels automatically.
   * This is the default behavior and important for the tab view feature.
   * Hint 2: Make sure that you know what you are doing if you set this property manually.
   *
   * @type {SideBarDef}
   * @memberof TableConfig
   */
  sideBar?: SideBarDef;

  /**
   * The height of the header in pixels.
   * 0 means disabled.
   *
   * @type {number}
   * @memberof TableConfig
   */
  headerHeight?: number;

  /**
   * Is the cell selection enabled?
   *
   * @type {boolean}
   * @memberof TableConfig
   */
  cellSelection?: boolean;

  /**
   * Suppress the cell focus.
   *
   * @type {boolean}
   * @memberof TableConfig
   */
  suppressCellFocus?: boolean;
}
/**
 * The Is Server Side Group Open By Default Type.
 *
 * @export
 * @type {(params: IsServerSideGroupOpenByDefaultParams) => boolean}
 */
export type IsServerSideGroupOpenByDefault = (
  params: IsServerSideGroupOpenByDefaultParams
) => boolean;

/**
 * The Server Side Auto Group Props Interface.
 *
 * @export
 * @interface ServerSideAutoGroupProps
 */
export interface ServerSideAutoGroupProps {
  autoGroupColumnDef: ColDef;
  isServerSideGroup: IsServerSideGroup;
  getServerSideGroupKey: GetServerSideGroupKey;
  isServerSideGroupOpenByDefault?: IsServerSideGroupOpenByDefault;
}

/**
 * The Custom Tree Data Interface.
 *
 * @export
 * @interface CustomTreeData
 */
export interface CustomTreeData {
  getDataPath: (data: any) => string[];
  autoGroupColumnDef: ColDef;
  onCellDoubleClicked: (params: CellDoubleClickedEvent) => void;
  onCellKeyDown: (params: CellKeyDownEvent) => void;
  isGroupOpenByDefault: () => boolean;
  suppressGroupRowsSticky: boolean;
}

/**
 * Our custom extended column definitions interface.
 *
 * @export
 * @interface ExtendedColumnDefs
 * @extends {ColDef}
 */
export interface ExtendedColumnDefs extends ColDef {
  visible?: boolean;
  alwaysVisible?: boolean;
  order?: number;
}

/**
 * The Named Column Definitions Interface.
 *
 * @export
 * @interface NamedColumnDefs
 */
export interface NamedColumnDefs {
  layoutId: number;
  title: string;
  columnDefs: ExtendedColumnDefs[];
}
