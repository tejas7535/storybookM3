import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import {
  CalculationRequestPayload,
  MMBearingPreflightResponse,
  PreflightRequestBody,
  SearchResult,
  ShaftMaterialResponse,
  SimpleListResponse,
} from '@mm/shared/models';
import { withCache } from '@ngneat/cashew';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BearinxOnlineResult } from '../bearinx-result.interface';
import { environment } from './../../../../environments/environment';
import {
  BEARING_MATERIAL_RESPONSE_MOCK,
  BEARING_PREFLIGHT_RESPONSE_MOCK,
  BEARING_SEARCH_RESULT_MOCK,
  REPORT_RESPONSE_MOCK,
  SIMPLE_LIST_RESPONSE,
} from './../../../../testing/mocks/rest.service.mock';
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
        `${environment.baseUrl}/bearings/search?pattern=theQuery&page=1&size=1000`
      );
      expect(req.request.method).toBe('GET');
      req.flush(BEARING_SEARCH_RESULT_MOCK);
    });
  });

  describe('#getBearingCalculationResult', () => {
    it('should send a bearing calculation request with given form properties', (done) => {
      service
        .getBearingCalculationResult(
          {} as Partial<CalculationRequestPayload> as CalculationRequestPayload
        )
        .subscribe((result: BearinxOnlineResult) => {
          expect(result).toEqual(REPORT_RESPONSE_MOCK);
          done();
        });

      const req = httpMock.expectOne(`${environment.baseUrl}/calculate`);
      expect(req.request.method).toBe('POST');
      req.flush(REPORT_RESPONSE_MOCK);
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

      const req = httpMock.expectOne(`${environment.baseUrl}/dialog`);
      expect(req.request.method).toBe('POST');
      req.flush(BEARING_PREFLIGHT_RESPONSE_MOCK);
    });
  });

  describe('#getBearingMaterialResponse', () => {
    it('should send a bearing material request with given material', (done) => {
      const mockShaftMaterial = 'material1';
      service
        .getBearingsMaterialResponse(mockShaftMaterial)
        .subscribe((result: ShaftMaterialResponse) => {
          expect(result).toEqual(BEARING_MATERIAL_RESPONSE_MOCK);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/materials/${mockShaftMaterial}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(BEARING_MATERIAL_RESPONSE_MOCK);
    });
  });

  describe('#getLoadOptions', () => {
    it('should send a load option request with given url', (done) => {
      service
        .getLoadOptions<SimpleListResponse[]>('aUrl')
        .subscribe((result) => {
          expect(result).toEqual(SIMPLE_LIST_RESPONSE);
          done();
        });

      const req = httpMock.expectOne('aUrl');
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache());
      req.flush(SIMPLE_LIST_RESPONSE);
    });
  });

  describe('getBearinxVersions', () => {
    it('should call the service to get bearinx versions', waitForAsync(() => {
      const mockResult = [
        {
          name: 'bearinx',
          version: '1',
        },
      ];

      const expected = {
        bearinx: '1',
      };

      firstValueFrom(service.getBearinxVersions()).then((res) => {
        expect(res).toEqual(expected);
      });

      const req = httpMock.expectOne(
        `${environment.bearinxApiBaseUrl}/version`
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockResult);
    }));
  });
});
