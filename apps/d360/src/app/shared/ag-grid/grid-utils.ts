import { GridApi } from 'ag-grid-enterprise';

import { ColumnSetting, OverlayTypes } from '../components/table';
import { OverlayType } from './../components/table/enums/overlay-type.enum';

export function showFloatingFilters(
  gridApi: GridApi,
  visible: boolean,
  currentOverlay: OverlayTypes = null
) {
  if (!gridApi?.isDestroyed()) {
    const columnDefs = gridApi.getColumnDefs();

    if (columnDefs) {
      gridApi.setGridOption(
        'columnDefs',
        columnDefs.map((col) => ({ ...col, floatingFilter: visible }))
      );
    }

    gridApi.refreshHeader();
  }

  reopenOverlayIfNeeded(gridApi, currentOverlay);
}

export function reopenOverlayIfNeeded(
  gridApi: GridApi,
  currentOverlay: OverlayTypes
): void {
  if (!gridApi || gridApi?.isDestroyed() || !currentOverlay) {
    return;
  }

  if (currentOverlay === OverlayType.Message) {
    gridApi?.showNoRowsOverlay();
  } else if (currentOverlay === OverlayType.Loader) {
    gridApi?.hideOverlay();
    gridApi?.setGridOption('loading', true);
  }
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
      sort: col.sort || null,
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
