/* eslint-disable max-lines */

import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-enterprise';

import {
  DynamicTable,
  ExtendedColumnDefs,
  NamedColumnDefs,
  ServerSideAutoGroupProps,
  TableConfig,
} from '../interfaces';

/**
 * A Util Class to encapsulate most of the things needed for tables.
 * Hint: it is still work in progress.
 *
 * @export
 * @class TableCreator
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TableCreator {
  /**
   * Creates a table config object with default values.
   *
   * @static
   * @param {DynamicTable} {
   *     table,
   *     isLoading$,
   *     showLoaderForInfiniteScroll,
   *     hasTabView,
   *     maxAllowedTabs,
   *     tableClass,
   *     callbacks,
   *     hasToolbar,
   *     renderFloatingFilter,
   *   }
   * @return {DynamicTable}
   * @memberof TableCreator
   */
  public static get({
    table,
    isLoading$,
    showLoaderForInfiniteScroll,
    hasTabView,
    maxAllowedTabs,
    tableClass,
    callbacks,
    hasToolbar,
    renderFloatingFilter,
    customOnResetFilters,
    customGetFilterCount,
  }: DynamicTable): DynamicTable {
    return {
      table:
        table ??
        TableCreator.getTable({
          columnDefs: [],
          tableId: null,
        }),
      tableClass: tableClass ?? 'grow',
      isLoading$,
      showLoaderForInfiniteScroll,
      hasTabView,
      maxAllowedTabs,
      callbacks,
      hasToolbar: hasToolbar ?? true,
      renderFloatingFilter: renderFloatingFilter ?? true,
      customOnResetFilters: customOnResetFilters ?? null,
      customGetFilterCount: customGetFilterCount ?? null,
    };
  }

  /**
   * Creates a table config object with default values.
   *
   * @static
   * @param {TableConfig} table
   * @return {TableConfig}
   * @memberof TableCreator
   */
  public static getTable(table: TableConfig): TableConfig {
    const defaultColDef: ColDef = table?.defaultColDef ?? {
      menuTabs: ['filterMenuTab', 'generalMenuTab'],
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    };

    const columnDefs: NamedColumnDefs[] = this.toNamedColumnDefs(
      table.columnDefs
    );

    return {
      ...table,
      columnDefs,
      initialColumnDefs: [...columnDefs], // Hint: not writable!
      context: table?.context ?? {},
      defaultColDef,
      loadingMessage: translate(table?.loadingMessage ?? ''),
      noRowsMessage: translate(table?.noRowsMessage ?? 'hint.noData'),
      serverSideAutoGroup: table?.serverSideAutoGroup,
    };
  }

  /**
   * Create server side auto group configuration.
   *
   * @static
   * @param {ServerSideAutoGroupProps} {
   *     autoGroupColumnDef,
   *     isServerSideGroup,
   *     getServerSideGroupKey,
   *     isServerSideGroupOpenByDefault = () => false,
   *   }
   * @return {ServerSideAutoGroupProps}
   * @memberof TableCreator
   */
  public static getServerSideAutoGroup({
    autoGroupColumnDef,
    isServerSideGroup,
    getServerSideGroupKey,
    isServerSideGroupOpenByDefault = () => false,
  }: ServerSideAutoGroupProps): ServerSideAutoGroupProps {
    return {
      autoGroupColumnDef,
      isServerSideGroup,
      getServerSideGroupKey,
      isServerSideGroupOpenByDefault,
    };
  }

  /**
   * Converts the column definitions to named column definitions.
   *
   * @private
   * @static
   * @param {(ExtendedColumnDefs[] | NamedColumnDefs[])} columnDefs
   * @return {NamedColumnDefs[]}
   * @memberof TableCreator
   */
  private static toNamedColumnDefs(
    columnDefs: ExtendedColumnDefs[] | NamedColumnDefs[]
  ): NamedColumnDefs[] {
    if (
      !!columnDefs[0] &&
      'layoutId' in columnDefs[0] &&
      'title' in columnDefs[0] &&
      'columnDefs' in columnDefs[0]
    ) {
      return columnDefs as NamedColumnDefs[];
    }

    return [
      {
        layoutId: 0,
        title: translate('table.defaultTab'),
        columnDefs: columnDefs as ExtendedColumnDefs[],
      },
    ];
  }
}
