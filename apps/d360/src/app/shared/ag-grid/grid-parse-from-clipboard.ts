import { Column, GridApi } from 'ag-grid-enterprise';

export function gridParseFromClipboard(
  gridApi: GridApi,
  data: string[][],
  parseSpecialFields?: (fieldName: string, cellDataToAdd: string) => string
): any {
  const focusedCell = gridApi.getFocusedCell();
  if (!focusedCell) {
    return null;
  }

  const startColumn = focusedCell.column;

  const existingRowData: any[] = [];
  gridApi.forEachNode((node) => {
    existingRowData.push(node.data);
  });

  const addRows: any[] = [];
  const updateRows: any[] = [];

  let currentEditingRowIndex: number = focusedCell.rowIndex;

  data.forEach((rowData) => {
    let currentEditingRowData: any = {};
    let isRowAlreadyInGrid = false;
    let currentEditingColumn: Column | null = startColumn;

    const existingData = existingRowData[currentEditingRowIndex];
    if (existingData) {
      currentEditingRowData = existingData;
      isRowAlreadyInGrid = true;
    }

    rowData.forEach((cellDataToAdd) => {
      const fieldName = currentEditingColumn.getColDef().field ?? '';
      if (!currentEditingColumn || !fieldName) {
        return;
      }

      const dataToAdd =
        parseSpecialFields === undefined
          ? cellDataToAdd
          : parseSpecialFields(fieldName, cellDataToAdd);
      currentEditingRowData[fieldName] = (dataToAdd || '').trim();

      currentEditingColumn = gridApi.getDisplayedColAfter(currentEditingColumn);
    });

    currentEditingRowIndex = currentEditingRowIndex + 1;

    if (isRowAlreadyInGrid) {
      updateRows.push(currentEditingRowData);
    } else {
      addRows.push(currentEditingRowData);
    }
  });

  gridApi.applyTransaction({
    addIndex: existingRowData.length,
    add: addRows,
    update: updateRows,
  });

  return null;
}
