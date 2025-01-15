import { GridApi } from 'ag-grid-enterprise';

import { ColumnSetting } from '../services/abstract-column-settings.service';

export function showFloatingFilters(gridApi: GridApi, visible: boolean) {
  const columnDefs = gridApi.getColumnDefs();

  if (columnDefs) {
    gridApi.setGridOption(
      'columnDefs',
      columnDefs.map((col) => ({ ...col, floatingFilter: visible }))
    );
  }

  gridApi.refreshHeader();
}

export function getColumnSettingsFromGrid<ColId extends string>(
  gridApi: GridApi
): ColumnSetting<ColId>[] {
  return gridApi.getColumnState().map(({ colId, hide }) => ({
    colId: colId as ColId, // it has to be a ColId since we filtered out undefined
    visible: !hide,
  }));
}

export function applyColumnSettings<ColId extends string>(
  gridApi: GridApi,
  columnDefinitions: ColumnSetting<ColId>[]
) {
  gridApi.applyColumnState({
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

  gridApi.setGridOption('rowData', [{}]);
}

export function ensureEmptyRowAtBottom(gridApi: GridApi) {
  const rowCount = gridApi.getDisplayedRowCount();

  const lastRow = gridApi.getDisplayedRowAtIndex(rowCount - 1);
  const lastRowHasData = Object.values(lastRow?.data || {}).some(Boolean);

  if (lastRowHasData || lastRow === undefined) {
    gridApi.applyTransaction({ addIndex: rowCount, add: [{}] });
  }
}

export function addRowsFromClipboard(gridApi: GridApi, data: string[][]): any {
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

      const nextColumn = gridApi.getDisplayedColAfter(currColumn);
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
