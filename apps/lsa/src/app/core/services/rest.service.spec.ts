import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  Grease,
  RecommendationRequest,
  RecommendationResponse,
} from '@lsa/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { RestService } from './rest.service';

describe('RestService', () => {
  let spectator: SpectatorService<RestService>;
  let service: RestService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: RestService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  describe('getGreases', () => {
    it('should fetch and emit the greases', () => {
      const url = `${service['BASE_URL']}/greases`;
      const mockResponse: Grease[] = [];

      service.greases$.next = jest.fn();

      service.getGreases();

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);

      expect(service.greases$.next).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getLubricatorRecommendation', () => {
    it('should fetch and emit the greases', () => {
      const url = `${service['BASE_URL']}/recommendation`;
      const mockRequest = {} as RecommendationRequest;
      const mockResponse = {} as RecommendationResponse;

      service.recommendation$.next = jest.fn();

      service.getLubricatorRecommendation(mockRequest);

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);

      req.flush(mockResponse);

      expect(service.recommendation$.next).toHaveBeenCalledWith(mockResponse);
    });
  });
});
