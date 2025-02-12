import { GridApi, GridReadyEvent } from 'ag-grid-community';

import { LoadingDataTableComponent } from './loading-data-table.component';

describe('LoadingDataTable', () => {
  let mockTable: LoadingDataTableComponent<number>;
  class LoadingDataTableMockComponent extends LoadingDataTableComponent<number> {}

  beforeEach(() => {
    mockTable = new LoadingDataTableMockComponent();
    mockTable.gridApi = {
      updateGridOptions: jest.fn(),
    } as unknown as GridApi;
  });

  test('set loading to true', () => {
    mockTable.loading = true;

    expect(mockTable.loading).toBeTruthy();
    expect(mockTable.gridApi.updateGridOptions).toHaveBeenCalledWith({
      loading: true,
    });
  });

  test('set loading to false', () => {
    mockTable.loading = false;

    expect(mockTable.loading).toBeFalsy();
    expect(mockTable.gridApi.updateGridOptions).toHaveBeenCalledWith({
      loading: false,
    });
  });

  test('set loading to undefined', () => {
    mockTable.loading = undefined;

    expect(mockTable.loading).toBeFalsy();
    expect(mockTable.gridApi.updateGridOptions).toHaveBeenCalledWith({
      loading: undefined,
    });
  });

  test('onGridReady', () => {
    const event = {
      api: { updateGridOptions: jest.fn() },
    } as unknown as GridReadyEvent<number>;
    mockTable.loading = true;

    mockTable.onGridReady(event);

    expect(mockTable.gridApi).toBe(event.api);
    expect(mockTable.gridApi.updateGridOptions).toHaveBeenCalledWith({
      loading: mockTable.loading,
    });
  });
});
