import { of, throwError } from 'rxjs';

import { Stub } from '../../test/stub.class';
import { BackendTableComponent } from './backend-table.component';
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
    it('should fetch data and update the grid when data is successfully fetched', (done) => {
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

      setTimeout(() => {
        expect(hideOverlaysSpy).toHaveBeenCalled();
        expect(dataFetchedEventSpy).toHaveBeenCalledWith({
          rowCount: 1,
        });
        expect(mockParams.success).toHaveBeenCalledWith({
          rowData: mockResponse.rows,
          rowCount: mockResponse.rowCount,
        });
        done();
      });
    });

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
  });
});
