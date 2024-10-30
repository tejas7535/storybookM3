import { ColumnApi, GridApi } from 'ag-grid-community';

import { ColumnSetting } from '../services/abstract-column-settings.service';

export function showFloatingFilters(gridApi: GridApi, visible: boolean) {
  const columnDefs = gridApi.getColumnDefs();

  if (columnDefs) {
    gridApi.setColumnDefs(
      columnDefs.map((col) => ({
        ...col,
        floatingFilter: visible,
      }))
    );
  }

  gridApi.refreshHeader();
}

export function getColumnSettingsFromGrid<ColId extends string>(
  columnApi: ColumnApi
): ColumnSetting<ColId>[] {
  return columnApi.getColumnState().map(({ colId, hide }) => ({
    colId: colId as ColId, // it has to be a ColId since we filtered out undefined
    visible: !hide,
  }));
}

export function applyColumnSettings<ColId extends string>(
  columnApi: ColumnApi,
  columnDefinitions: ColumnSetting<ColId>[]
) {
  columnApi.applyColumnState({
    state: columnDefinitions.map((col) => ({
      colId: col.colId,
      hide: !col.visible,
      sort: col.sort,
    })),
    applyOrder: true,
  });
}

export function resetGrid(gridApi: GridApi) {
  if (!gridApi) {
    return;
  }

  gridApi.setRowData([{}]);
}

export function ensureEmptyRowAtBottom(gridApi: GridApi) {
  const rowCount = gridApi.getModel().getRowCount();

  const lastRow = gridApi.getModel().getRow(rowCount - 1);
  const lastRowHasData = Object.values(lastRow?.data || {}).some(Boolean);

  if (lastRowHasData || lastRow === undefined) {
    gridApi.applyTransaction({ addIndex: rowCount, add: [{}] });
  }
}

export function addRowsFromClipboard(
  gridApi: GridApi,
  columnApi: ColumnApi,
  data: string[][]
): any {
  const focusedCell = gridApi.getFocusedCell();
  if (!focusedCell) {
    return null;
  }

  const newRows = data.map((row) => {
    const newRow: any = {};
    let currColumn = focusedCell.column;

    for (const columnData of row) {
      const fieldName = currColumn.getColDef().field;
      if (!fieldName) {
        continue;
      }

      newRow[fieldName] = columnData;

      const nextColumn = columnApi.getDisplayedColAfter(currColumn);
      if (!nextColumn) {
        return;
      } // no more in row -> cancel
      currColumn = nextColumn;
    }

    return newRow;
  });

  gridApi.applyTransaction({ addIndex: focusedCell.rowIndex, add: newRows });

  return null;
}
