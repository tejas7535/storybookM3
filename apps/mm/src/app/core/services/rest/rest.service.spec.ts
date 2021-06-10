import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ENV_CONFIG } from '@schaeffler/http';

import {
  MMBearingPreflightResponse,
  MMBearingsMaterialResponse,
  MMResponseVariants,
  PreflightRequestBody,
} from '../../../shared/models';
import { environment } from './../../../../environments/environment';
import {
  BEARING_CALCULATION_RESULT_MOCK,
  BEARING_MATERIAL_RESPONSE_MOCK,
  BEARING_PREFLIGHT_RESPONSE_MOCK,
  BEARING_SEARCH_RESULT_MOCK,
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
    imports: [HttpClientTestingModule],
    providers: [
      RestService,
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
            preflightPath: 'bearing-preflight',
            materialsPath: 'materialdata/id/',
            bearingRelationsPath: 'bearing-relations/',
            bearingCalculationPath: 'bearing-calculation',
          },
        },
      },
    ],
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
        `/bearing/search/?pattern=theQuery&page=1&size=1000`
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
        `/${environment.bearingRelationsPath}theId`
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

      const req = httpMock.expectOne(`/${environment.bearingCalculationPath}`);
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

      const req = httpMock.expectOne(`/${environment.preflightPath}`);
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
        `/${environment.materialsPath}${mockShaftMaterial}?cache$=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush(BEARING_MATERIAL_RESPONSE_MOCK);
    });
  });

  describe('#getLoadOptions', () => {
    it('should send a load option request with given url', (done) => {
      service.getLoadOptions('aUrl').subscribe((result: MMResponseVariants) => {
        expect(result).toEqual(LOAD_OPTIONS_RESPONSE_MOCK);
        done();
      });

      const req = httpMock.expectOne('/aUrl?cache$=true');
      expect(req.request.method).toBe('GET');
      req.flush(LOAD_OPTIONS_RESPONSE_MOCK);
    });
  });
});
