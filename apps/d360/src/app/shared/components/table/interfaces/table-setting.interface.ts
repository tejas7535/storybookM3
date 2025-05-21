import { ViewToggle } from '@schaeffler/view-toggle';

/**
 * The column setting type / interface.
 *
 * @export
 * @interface ColumnSetting
 * @template COLUMN_KEYS
 */
export interface ColumnSetting<COLUMN_KEYS extends string> {
  colId: COLUMN_KEYS;
  visible: boolean;
  sort?: 'asc' | 'desc' | null;
  filterModel?: any;
  filter?: any;
  order?: number;
  alwaysVisible?: boolean;
}

/**
 * The table setting type / interface.
 *
 * @export
 * @interface TableSetting
 * @template COLUMN_KEYS
 */
export type TableSetting<COLUMN_KEYS extends string> = ViewToggle & {
  defaultSetting: boolean;
  layoutId?: number;
  columns: ColumnSetting<COLUMN_KEYS>[];
};
