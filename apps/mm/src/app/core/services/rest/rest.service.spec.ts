import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { withCache } from '@ngneat/cashew';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  MMBearingPreflightResponse,
  MMBearingsMaterialResponse,
  MMResponseVariants,
  PreflightRequestBody,
} from '../../../shared/models';
import { BearinxOnlineResult } from '../bearinx-result.interface';
import { environment } from './../../../../environments/environment';
import {
  BEARING_CALCULATION_RESULT_MOCK,
  BEARING_MATERIAL_RESPONSE_MOCK,
  BEARING_PREFLIGHT_RESPONSE_MOCK,
  BEARING_SEARCH_RESULT_MOCK,
  JSON_REPORT_RESPONSE_MOCK,
  LOAD_OPTIONS_RESPONSE_MOCK,
} from './../../../../testing/mocks/rest.service.mock';
import { SearchResult } from './../../../shared/models/bearing-search/bearing-search.model';
import { RestService } from './rest.service';

describe('RestService', () => {
  let spectator: SpectatorService<RestService>;
  let service: RestService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: RestService,
    imports: [],
    providers: [RestService, provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(RestService);
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getBearingSearch', () => {
    it('should send a bearing search request with given query', (done) => {
      service.getBearingSearch('theQuery').subscribe((result: SearchResult) => {
        expect(result).toEqual(BEARING_SEARCH_RESULT_MOCK);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearing/search/?pattern=theQuery&page=1&size=1000`
      );
      expect(req.request.method).toBe('GET');
      req.flush(BEARING_SEARCH_RESULT_MOCK);
    });
  });

  describe('#getBearingRelations', () => {
    it('should send a bearing relation request with given id', (done) => {
      service.getBearingRelations('theId').subscribe((result: SearchResult) => {
        expect(result).toEqual({});
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${environment.bearingRelationsPath}theId`
      );
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('#getBearingCalculationResult', () => {
    it('should send a bearing calculation request with given form properties', (done) => {
      service
        .getBearingCalculationResult('some form properties i guess')
        .subscribe((result: SearchResult) => {
          expect(result).toEqual(BEARING_CALCULATION_RESULT_MOCK);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${environment.bearingCalculationPath}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(BEARING_CALCULATION_RESULT_MOCK);
    });
  });

  describe('#getBearingPreflightResponse', () => {
    it('should send a bearing preflight request with given body', (done) => {
      service
        .getBearingPreflightResponse({} as PreflightRequestBody)
        .subscribe((result: MMBearingPreflightResponse) => {
          expect(result).toEqual(BEARING_PREFLIGHT_RESPONSE_MOCK);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${environment.preflightPath}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(BEARING_PREFLIGHT_RESPONSE_MOCK);
    });
  });

  describe('#getBearingMaterialResponse', () => {
    it('should send a bearing material request with given material', (done) => {
      const mockShaftMaterial = 'material1';
      service
        .getBearingsMaterialResponse(mockShaftMaterial)
        .subscribe((result: MMBearingsMaterialResponse) => {
          expect(result).toEqual(BEARING_MATERIAL_RESPONSE_MOCK);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${environment.materialsPath}${mockShaftMaterial}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(BEARING_MATERIAL_RESPONSE_MOCK);
    });
  });

  describe('#getLoadOptions', () => {
    it('should send a load option request with given url', (done) => {
      service.getLoadOptions('aUrl').subscribe((result: MMResponseVariants) => {
        expect(result).toEqual(LOAD_OPTIONS_RESPONSE_MOCK);
        done();
      });

      const req = httpMock.expectOne('aUrl');
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(LOAD_OPTIONS_RESPONSE_MOCK);
    });
  });

  describe('#getPdfReportResponse', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true on success', (done) => {
      service.getPdfReportRespone('testUrl').subscribe((result) => {
        expect(result).toBe(true);
        done();
      });

      const req = httpMock.expectOne('testUrl');
      expect(req.request.method).toBe('GET');
      req.flush(new Blob());
    });

    it('should retry on error', (done) => {
      service.getPdfReportRespone('testUrl').subscribe((result) => {
        expect(result).toBe(true);
        done();
      });

      const reqError = httpMock.expectOne('testUrl');
      expect(reqError.request.method).toBe('GET');
      reqError.error(new ProgressEvent('Not Found'));

      jest.advanceTimersByTime(500);

      httpMock.expectNone('testUrl');

      jest.advanceTimersByTime(2500);

      for (let i = 0; i < 10; i = i + 1) {
        const reqErrorWaiting = httpMock.expectOne('testUrl');
        expect(reqErrorWaiting.request.method).toBe('GET');
        reqErrorWaiting.error(new ProgressEvent('Not Found'));

        if (i > 8) {
          httpMock.expectNone('testUrl');
          jest.advanceTimersByTime(7000);
        }
        jest.advanceTimersByTime(3000);
      }

      const req = httpMock.expectOne('testUrl');
      expect(req.request.method).toBe('GET');
      req.flush(new Blob());
    });
  });

  describe('#getJsonReportResponse', () => {
    it('should get json report data', (done) => {
      service
        .getJsonReportResponse('jsonUrl')
        .subscribe((result: BearinxOnlineResult) => {
          expect(result).toEqual(JSON_REPORT_RESPONSE_MOCK);
          done();
        });

      const req = httpMock.expectOne('jsonUrl');
      expect(req.request.method).toBe('GET');
      req.flush(JSON_REPORT_RESPONSE_MOCK);
    });
  });
});
