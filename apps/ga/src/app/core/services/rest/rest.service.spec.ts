import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  BEARING_SEARCH_RESULT_MOCK,
  CALCULATION_PARAMETERS_MOCK,
  CALCULATION_RESULT_MOCK,
  CALCULATION_RESULT_MOCK_ID,
  ADVANCED_BEARING_SELECTION_FILTERS_MOCK,
  MOCK_PROPERTIES,
  MODEL_MOCK_ID,
} from '@ga/testing/mocks';

import { environment } from '../../../../environments/environment';
import { Property } from '../../../shared/models';
import { RestService } from './rest.service';

describe('RestService', () => {
  let spectator: SpectatorService<RestService>;
  let service: RestService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: RestService,
    imports: [HttpClientTestingModule],
    providers: [RestService],
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
      service.getBearingSearch('theQuery').subscribe((result: string[]) => {
        expect(result).toEqual(BEARING_SEARCH_RESULT_MOCK);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings/search?pattern=theQuery`
      );
      expect(req.request.method).toBe('GET');
      req.flush(BEARING_SEARCH_RESULT_MOCK);
    });
  });

  describe('#getBearingExtendedSearch', () => {
    it('should send a extended bearing search request with params', (done) => {
      service
        .getBearingExtendedSearch(ADVANCED_BEARING_SELECTION_FILTERS_MOCK)
        .subscribe((result: string[]) => {
          expect(result).toEqual(BEARING_SEARCH_RESULT_MOCK);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings/extendedsearch?bearingType=IDO_RADIAL_BALL_BEARING&minDi=123&maxDi=456&minDa=789&maxDa=1011&minB=1213&maxB=1415`
      );
      expect(req.request.method).toBe('GET');
      req.flush(BEARING_SEARCH_RESULT_MOCK);
    });
  });

  describe('getBearingExtendedSearchCount', () => {
    it('should send a extended bearing search request with params', (done) => {
      service
        .getBearingExtendedSearchCount({
          ...ADVANCED_BEARING_SELECTION_FILTERS_MOCK,
          boreDiameterMin: undefined,
        })
        .subscribe((result: number) => {
          expect(result).toEqual(2);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings/extendedsearch/count?bearingType=IDO_RADIAL_BALL_BEARING&maxDi=456&minDa=789&maxDa=1011&minB=1213&maxB=1415`
      );
      expect(req.request.method).toBe('GET');
      req.flush(2);
    });
  });

  describe('#getProperties', () => {
    it('should get the properties for a model', (done) => {
      const mockModelId = 'mockModelId';

      service.getProperties(mockModelId).subscribe((result: Property[]) => {
        expect(result).toEqual(MOCK_PROPERTIES);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${mockModelId}/properties`
      );
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PROPERTIES);
    });
  });

  describe('#putModelCreate', () => {
    it('should send model create put request with a bearing', (done) => {
      const mockBearing = 'mockBearing';

      service.putModelCreate(mockBearing).subscribe((result: string) => {
        expect(result).toEqual(MODEL_MOCK_ID);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/create?designation=${mockBearing}`
      );
      expect(req.request.method).toBe('PUT');
      req.flush(MODEL_MOCK_ID);
    });
  });

  describe('#putModelUpdate', () => {
    it('should send model update put request with modelId and greaseParams', (done) => {
      service
        .putModelUpdate(MODEL_MOCK_ID, CALCULATION_PARAMETERS_MOCK)
        .subscribe((result: string) => {
          expect(result).toEqual(CALCULATION_PARAMETERS_MOCK);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${MODEL_MOCK_ID}/update`
      );
      expect(req.request.method).toBe('PUT');
      req.flush(CALCULATION_PARAMETERS_MOCK);
    });
  });

  describe('#getGreaseCalculation', () => {
    it('should send a calculation get request with given params', (done) => {
      const mockModelId = 'mockModelId';

      service.getGreaseCalculation(mockModelId).subscribe((result: string) => {
        expect(result).toEqual(CALCULATION_RESULT_MOCK_ID);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${mockModelId}/calculate`
      );
      expect(req.request.method).toBe('GET');
      req.flush(CALCULATION_RESULT_MOCK);
    });
  });
});
