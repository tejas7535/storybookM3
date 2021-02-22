import {
  GridOptions,
  ServerSideStoreType,
} from '@ag-grid-community/all-modules';

export const GRID_OPTIONS: GridOptions = {
  rowModelType: 'serverSide',
  pagination: true,
  paginationPageSize: 25,
  cacheBlockSize: 25,
  serverSideStoreType: ServerSideStoreType.Partial,
};
