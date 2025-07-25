import { HttpContext, HttpResponse } from '@angular/common/http';

import { of, take, throwError } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { Stub } from './../../../../shared/test/stub.class';
import { getErrorMessage } from './../../../../shared/utils/errors';
import { HttpError } from './../../../../shared/utils/http-client';
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

    it('should handle errors with custom error messages for max count exceeded', (done) => {
      const problemDetail = {
        title: 'Export Failed',
        detail: 'Maximum count exceeded',
        code: 'material_customer.export.maxCountExceeded',
        values: { max_count: 5000 },
      };
      const mockError = new HttpError(400, problemDetail);

      httpClientSpy.mockReturnValue(throwError(() => mockError));

      service
        .triggerExport(mockGridApi, mockGlobalSelectionFilters)
        .pipe(take(1))
        .subscribe(() => {
          expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining('material_customer.export.failed')
          );
          expect(appInsightsSpy).toHaveBeenCalledWith(
            '[Home] Export Field List Data Failure'
          );
          done();
        });
    });

    it('should call custom error handler for maxCountExceeded', () => {
      const problemDetail = {
        title: 'Export Failed',
        detail: 'Maximum count exceeded',
        code: 'material_customer.export.maxCountExceeded',
        values: { max_count: 5000 },
      };
      const mockError = new HttpError(400, problemDetail);

      const customErrorMessages = {
        'material_customer.export.maxCountExceeded': (detail: any) =>
          translate('material_customer.export.maxCountExceeded', {
            max_count: detail.values?.max_count,
          }),
      };

      const result = getErrorMessage(mockError, customErrorMessages);

      expect(result).toBe('material_customer.export.maxCountExceeded');
    });

    it('should handle errors with custom error messages for export failed', (done) => {
      const problemDetail = {
        title: 'Export Failed',
        detail: 'Export operation failed',
        code: 'material_customer.export.failed',
        values: { reason: 'Server timeout' },
      };
      const mockError = new HttpError(400, problemDetail);

      httpClientSpy.mockReturnValue(throwError(() => mockError));

      service
        .triggerExport(mockGridApi, mockGlobalSelectionFilters)
        .pipe(take(1))
        .subscribe(() => {
          expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining('material_customer.export.failed')
          );
          expect(appInsightsSpy).toHaveBeenCalledWith(
            '[Home] Export Field List Data Failure'
          );
          done();
        });
    });

    it('should handle generic errors without custom error messages', (done) => {
      const mockError = new Error('Generic HTTP error');

      httpClientSpy.mockReturnValue(throwError(() => mockError));

      service
        .triggerExport(mockGridApi, mockGlobalSelectionFilters)
        .pipe(take(1))
        .subscribe(() => {
          expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining('material_customer.export.failed')
          );
          expect(appInsightsSpy).toHaveBeenCalledWith(
            '[Home] Export Field List Data Failure'
          );
          done();
        });
    });
  });
});
