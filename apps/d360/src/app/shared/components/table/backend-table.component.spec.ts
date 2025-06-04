import { fakeAsync, tick } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { Stub } from '../../test/stub.class';
import { BackendTableComponent } from './backend-table.component';
import { RequestType } from './enums';
import { BackendTableResponse } from './interfaces';

describe('BackendTableComponent', () => {
  let component: BackendTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<BackendTableComponent>({
      component: BackendTableComponent,
    });

    // Mock gridApi
    component['gridApi'] = Stub.getGridApi();
  });

  describe('loadData', () => {
    it('should throw an error when called', () => {
      expect(() => component['loadData']()).toThrow(
        '[TableWrapper] Not available for backend tables'
      );
    });
  });

  describe('init', () => {
    it('should set the serverSideDatasource on the gridApi', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const getDataSourceSpy = jest.spyOn<any, any>(component, 'getDataSource');

      component['init']();

      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'serverSideDatasource',
        getDataSourceSpy.mock.results[0].value
      );
    });
  });

  describe('getDataSource', () => {
    it('should fetch data and update the grid when data is successfully fetched', fakeAsync(() => {
      const mockParams = {
        request: {
          startRow: 0,
          endRow: 10,
          sortModel: [],
          filterModel: {},
          groupKeys: [],
        },
        parentNode: {
          level: -1,
        },
        success: jest.fn(),
      } as any;

      const mockResponse: BackendTableResponse = {
        rows: [{ id: 1, name: 'Test Row' }],
        rowCount: 1,
      };

      const getDataSpy = jest.fn().mockReturnValue(of(mockResponse));
      const hideOverlaysSpy = jest.spyOn<any, any>(component, 'hideOverlays');
      const dataFetchedEventSpy = jest.spyOn(
        component['dataFetchedEvent$'](),
        'next'
      );

      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      const dataSource = component['getDataSource']();
      dataSource.getRows(mockParams);

      tick(100);

      expect(hideOverlaysSpy).toHaveBeenCalled();
      expect(dataFetchedEventSpy).toHaveBeenCalledWith({
        rowCount: 1,
      });
      expect(mockParams.success).toHaveBeenCalledWith({
        rowData: mockResponse.rows,
        rowCount: mockResponse.rowCount,
      });
    }));

    it('should show a no rows message when the response contains no data', (done) => {
      const mockParams = {
        request: {
          startRow: 0,
          endRow: 10,
          sortModel: [],
          filterModel: {},
          groupKeys: [],
        },
        success: jest.fn(),
      } as any;

      const mockResponse: BackendTableResponse = {
        rows: [],
        rowCount: 0,
      };

      const getDataSpy = jest.fn().mockReturnValue(of(mockResponse));
      const showMessageSpy = jest.spyOn<any, any>(component, 'showMessage');

      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      const dataSource = component['getDataSource']();
      dataSource.getRows(mockParams);

      setTimeout(() => {
        expect(showMessageSpy).toHaveBeenCalledWith('');
        done();
      });
    });

    it('should handle fetch errors gracefully', (done) => {
      const mockParams = {
        request: {
          startRow: 0,
          endRow: 10,
          sortModel: [],
          filterModel: {},
          groupKeys: [],
        },
        success: jest.fn(),
      } as any;

      const getDataSpy = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('Fetch error')));
      const handleFetchErrorSpy = jest.spyOn<any, any>(
        component,
        'handleFetchError$'
      );

      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      const dataSource = component['getDataSource']();
      dataSource.getRows(mockParams);

      setTimeout(() => {
        expect(handleFetchErrorSpy).toHaveBeenCalledWith(
          new Error('Fetch error'),
          mockParams
        );
        done();
      });
    });

    it('should replace "ag-Grid-AutoColumn" in sortModel with autoGroupColumnDef.field', () => {
      const mockParams = {
        request: {
          startRow: 0,
          endRow: 10,
          sortModel: [{ colId: 'ag-Grid-AutoColumn', sort: 'asc' }],
          filterModel: {},
          groupKeys: [],
        },
        success: jest.fn(),
        api: {
          getGridOption: jest.fn().mockReturnValue({ field: 'groupField' }),
        },
      } as any;

      const getDataSpy = jest
        .fn()
        .mockReturnValue(of({ rows: [], rowCount: 0 }));
      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      const dataSource = component['getDataSource']();
      dataSource.getRows(mockParams);

      expect(mockParams.request.sortModel[0].colId).toBe('groupField');
    });

    it('should set loading option based on showLoaderForInfiniteScroll', fakeAsync(() => {
      const mockParams = {
        request: {
          startRow: 0,
          endRow: 10,
          sortModel: [],
          filterModel: {},
          groupKeys: [],
        },
        success: jest.fn(),
      } as any;

      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      const getDataSpy = jest
        .fn()
        .mockReturnValue(of({ rows: [], rowCount: 0 }));

      Stub.setInput('config', { showLoaderForInfiniteScroll: true });
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      const dataSource = component['getDataSource']();
      dataSource.getRows(mockParams);

      expect(setGridOptionSpy).toHaveBeenCalledWith('loading', true);
    }));

    it('should use custom no rows message from config when available', fakeAsync(() => {
      const mockParams = {
        request: {
          startRow: 0,
          endRow: 10,
          sortModel: [],
          filterModel: {},
          groupKeys: [],
        },
        success: jest.fn(),
        parentNode: { level: -1 },
      } as any;

      const customMessage = 'Custom no rows message';
      const mockResponse: BackendTableResponse = {
        rows: [],
        rowCount: 0,
      };

      const getDataSpy = jest.fn().mockReturnValue(of(mockResponse));
      const showMessageSpy = jest.spyOn<any, any>(component, 'showMessage');

      Stub.setInput('config', { table: { noRowsMessage: customMessage } });
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      const dataSource = component['getDataSource']();
      dataSource.getRows(mockParams);

      tick(100);

      expect(showMessageSpy).toHaveBeenCalledWith(customMessage);
    }));

    it('should only call dataFetchedEvent on first load and at root level', fakeAsync(() => {
      // Test for subsequent data loading
      const mockParams = {
        request: {
          startRow: 10, // Not starting at 0 (subsequent load)
          endRow: 20,
          sortModel: [],
          filterModel: {},
          groupKeys: [],
        },
        parentNode: { level: -1 },
        success: jest.fn(),
      } as any;

      const mockResponse: BackendTableResponse = {
        rows: [{ id: 1, name: 'Test Row' }],
        rowCount: 100,
      };

      const getDataSpy = jest.fn().mockReturnValue(of(mockResponse));
      const dataFetchedEventSpy = jest.spyOn(
        component['dataFetchedEvent$'](),
        'next'
      );

      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      const dataSource = component['getDataSource']();
      dataSource.getRows(mockParams);

      tick(100);

      // Should only call with response rowCount after the delay
      expect(dataFetchedEventSpy).toHaveBeenCalledTimes(1);
      expect(dataFetchedEventSpy).toHaveBeenCalledWith({ rowCount: 100 });
    }));

    it('should process filterModel correctly', fakeAsync(() => {
      const mockFilterModel = {
        name: { filterType: 'text', type: 'contains', filter: 'test' },
      };
      const mockParams = {
        request: {
          startRow: 0,
          endRow: 10,
          sortModel: [],
          filterModel: mockFilterModel,
          groupKeys: [],
        },
        parentNode: { level: -1 },
        success: jest.fn(),
      } as any;

      const getDataSpy = jest
        .fn()
        .mockReturnValue(of({ rows: [], rowCount: 0 }));

      // Mock the imported formatter function
      jest.mock('../../ag-grid/grid-filter-model', () => ({
        formatFilterModelForBackend: jest
          .fn()
          .mockReturnValue({ name: 'formatted-filter' }),
      }));

      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      const dataSource = component['getDataSource']();
      dataSource.getRows(mockParams);

      tick(100);

      // Verify getData was called with properly formatted filter
      expect(getDataSpy).toHaveBeenCalled();
      const requestParams = getDataSpy.mock.calls[0][0];
      expect(requestParams.columnFilters.length).toBeGreaterThan(0);
    }));

    it('should use different request type for group clicks', fakeAsync(() => {
      const mockParams = {
        request: {
          startRow: 0,
          endRow: 10,
          sortModel: [],
          filterModel: {},
          groupKeys: ['group1'], // Has group keys
        },
        success: jest.fn(),
      } as any;

      const getDataSpy = jest
        .fn()
        .mockReturnValue(of({ rows: [], rowCount: 0 }));

      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      const dataSource = component['getDataSource']();
      dataSource.getRows(mockParams);

      tick(100);

      // Check that RequestType.GroupClick was passed as the second parameter
      expect(getDataSpy).toHaveBeenCalledWith(
        expect.anything(),
        RequestType.GroupClick
      );
    }));
  });
});
