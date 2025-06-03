import { Observable, of } from 'rxjs';

import {
  BackendTableResponse,
  RequestParams,
} from '../../../../shared/components/table/interfaces';
import { Stub } from './../../../../shared/test/stub.class';
import { MaterialCustomerTableService } from './material-customer-table.service';

describe('MaterialCustomerTableService', () => {
  let service: MaterialCustomerTableService;
  let httpClientSpy: jest.SpyInstance<Observable<unknown>>;

  beforeEach(() => {
    service = Stub.get({
      component: MaterialCustomerTableService,
    });

    httpClientSpy = jest.spyOn(service['http'], 'post');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMaterialCustomerData', () => {
    it('should make HTTP POST request with correct parameters', () => {
      const mockResponse: BackendTableResponse = {
        rows: [{ id: 1, name: 'Test Material' }],
        rowCount: 1,
      };
      httpClientSpy.mockReturnValue(of(mockResponse));

      const selectionFilters = { category: 'test-category' };
      const params: RequestParams = {
        startRow: 0,
        endRow: 10,
        sortModel: [{ colId: 'name', sort: 'asc' }],
        columnFilters: [{ name: 'test' }],
        groupKeys: [],
      };

      let result: BackendTableResponse | undefined;
      service
        .getMaterialCustomerData(selectionFilters, params)
        .subscribe((response) => {
          result = response;
        });

      expect(httpClientSpy).toHaveBeenCalledWith('api/material-customer', {
        startRow: params.startRow,
        endRow: params.endRow,
        sortModel: params.sortModel,
        selectionFilters,
        columnFilters: params.columnFilters,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty selection filters', () => {
      const mockResponse: BackendTableResponse = {
        rows: [],
        rowCount: 0,
      };
      httpClientSpy.mockReturnValue(of(mockResponse));

      const emptySelectionFilters = {};
      const params: RequestParams = {
        startRow: 0,
        endRow: 50,
        sortModel: [],
        columnFilters: [],
        groupKeys: [],
      };

      let result: BackendTableResponse | undefined;
      service
        .getMaterialCustomerData(emptySelectionFilters, params)
        .subscribe((response) => {
          result = response;
        });

      expect(httpClientSpy).toHaveBeenCalledWith('api/material-customer', {
        startRow: 0,
        endRow: 50,
        sortModel: [],
        selectionFilters: emptySelectionFilters,
        columnFilters: [],
      });
      expect(result).toEqual(mockResponse);
    });

    it('should pass complex selection filters correctly', () => {
      httpClientSpy.mockReturnValue(of({}));

      const complexFilters = {
        materialNumber: '12345',
        customerName: 'Test Customer',
        nestedFilters: {
          region: 'Europe',
          active: true,
        },
      };

      const params: RequestParams = {
        startRow: 0,
        endRow: 25,
        sortModel: [{ colId: 'materialNumber', sort: 'desc' }],
        columnFilters: [],
        groupKeys: [],
      };

      service.getMaterialCustomerData(complexFilters, params).subscribe();

      expect(httpClientSpy).toHaveBeenCalledWith(
        'api/material-customer',
        expect.objectContaining({
          selectionFilters: complexFilters,
        })
      );
    });
  });
});
