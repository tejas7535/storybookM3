import { IServerSideDatasource } from 'ag-grid-community';

export const DATA_FETCHED_EVENT = 'X-dataFetched';
export const FETCH_ERROR_EVENT = 'X-fetchError';

export function createEmptyDatasource(): IServerSideDatasource {
  return {
    getRows(params) {
      params.success({ rowData: [], rowCount: 0 });
    },
  };
}

export function getIdForRow(row: any) {
  if (row.id === undefined && row.data.id === undefined) {
    throw new Error('Could not find id in row.');
  } else if (row.id != null) {
    return row.id as string;
  }

  return row.data.id as string;
}
