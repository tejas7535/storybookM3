import { IServerSideGetRowsRequest } from '@ag-grid-enterprise/all-modules';

export const requestParamsMock: IServerSideGetRowsRequest = {
  startRow: 0,
  endRow: 25,
  rowGroupCols: undefined,
  valueCols: undefined,
  pivotCols: undefined,
  pivotMode: undefined,
  groupKeys: undefined,
  filterModel: {},
  sortModel: [],
};
