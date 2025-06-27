import { HttpContext, HttpResponse } from '@angular/common/http';

import { of, take, throwError } from 'rxjs';

import { Stub } from './../../../../shared/test/stub.class';
import { ExportMaterialCustomerService } from './export-material-customer.service';

describe('ExportMaterialCustomerService', () => {
  let service: ExportMaterialCustomerService;
  let httpClientSpy: jest.SpyInstance;
  let successSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let streamSaverServiceSpy: jest.SpyInstance;
  let appInsightsSpy: jest.SpyInstance;

  const mockGridApi = Stub.getGridApi();

  const mockGlobalSelectionFilters = {
    productLine: ['PL1'],
    region: ['EU'],
  };

  beforeEach(() => {
    service = Stub.get({
      component: ExportMaterialCustomerService,
      providers: [Stub.getStreamSaverServiceProvider()],
    });

    httpClientSpy = jest
      .spyOn(service['http'], 'post')
      .mockReturnValue(of(new HttpResponse({ body: new Blob(), status: 200 })));

    successSpy = jest.spyOn(service['snackbarService'], 'success');
    errorSpy = jest.spyOn(service['snackbarService'], 'error');
    streamSaverServiceSpy = jest.spyOn(
      service['streamSaverService'],
      'streamResponseToFile'
    );
    appInsightsSpy = jest.spyOn(service['appInsights'], 'logEvent');

    jest.spyOn(mockGridApi, 'getFilterModel').mockReturnValue({});
    jest.spyOn(mockGridApi, 'getColumnState').mockReturnValue([
      { colId: 'col1', sort: 'asc', hide: false },
      { colId: 'col2', sort: null, hide: false },
      { colId: '_hidden', sort: 'asc', hide: false },
    ]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('triggerExport', () => {
    it('should return EMPTY when gridApi is not provided', () => {
      const result = service.triggerExport(null, mockGlobalSelectionFilters);
      expect(result).toBeDefined();

      let emitted = false;
      result.pipe(take(1)).subscribe(() => {
        emitted = true;
      });

      expect(emitted).toBeFalsy();
      expect(httpClientSpy).not.toHaveBeenCalled();
    });

    it('should return EMPTY when globalSelectionFilters is not provided', () => {
      const result = service.triggerExport(mockGridApi, null);
      expect(result).toBeDefined();

      let emitted = false;
      result.pipe(take(1)).subscribe(() => {
        emitted = true;
      });

      expect(emitted).toBeFalsy();
      expect(httpClientSpy).not.toHaveBeenCalled();
    });

    it('should call HTTP post with correct parameters', (done) => {
      service
        .triggerExport(mockGridApi, mockGlobalSelectionFilters)
        .pipe(take(1))
        .subscribe(() => {
          expect(httpClientSpy).toHaveBeenCalledWith(
            'api/material-customer/export',
            expect.objectContaining({
              filteredRequest: expect.objectContaining({
                sortModel: [
                  { colId: 'col1', sort: 'asc' },
                  { colId: '_hidden', sort: 'asc' },
                ],
                selectionFilters: mockGlobalSelectionFilters,
              }),
              columns: ['col1', 'col2'], // excludes _hidden column
              translations: expect.any(Object),
            }),
            expect.objectContaining({
              responseType: 'blob',
              observe: 'response',
              context: expect.any(HttpContext),
            })
          );
          done();
        });
    });

    it('should show notification when export starts', () => {
      service
        .triggerExport(mockGridApi, mockGlobalSelectionFilters)
        .pipe(take(1))
        .subscribe();

      expect(successSpy).toHaveBeenCalledWith(
        'material_customer.export.downloadStarted'
      );
    });

    it('should handle successful export response', (done) => {
      const mockResponse = new HttpResponse({
        body: new Blob(['test']),
        status: 200,
      });

      httpClientSpy.mockReturnValue(of(mockResponse));

      service
        .triggerExport(mockGridApi, mockGlobalSelectionFilters)
        .pipe(take(1))
        .subscribe(() => {
          expect(streamSaverServiceSpy).toHaveBeenCalledWith(
            'export.xlsx',
            mockResponse
          );
          expect(appInsightsSpy).toHaveBeenCalledWith(
            '[Home] Export Field List Data Success'
          );
          done();
        });
    });

    it('should handle error response', (done) => {
      const errorResponse = {
        error: {
          code: 'material_customer.export.maxCountExceeded',
          detail: { values: { max_export_count: 1000 } },
        },
      };

      httpClientSpy.mockReturnValue(throwError(() => errorResponse));

      service
        .triggerExport(mockGridApi, mockGlobalSelectionFilters)
        .pipe(take(1))
        .subscribe(() => {
          expect(errorSpy).toHaveBeenCalledTimes(1);
          expect(appInsightsSpy).toHaveBeenCalledWith(
            '[Home] Export Field List Data Failure'
          );
          done();
        });
    });
  });
});
