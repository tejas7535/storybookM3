import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ENV_CONFIG } from '@schaeffler/http';

import { BEARING_SEARCH_RESULT_MOCK } from './../../../../testing/mocks/rest.service.mock';
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
      service.getBearingSearch('theQuery').subscribe((result: string[]) => {
        expect(result).toEqual(BEARING_SEARCH_RESULT_MOCK);
        done();
      });

      const req = httpMock.expectOne(`/bearings/search?pattern=theQuery`);
      expect(req.request.method).toBe('GET');
      req.flush(BEARING_SEARCH_RESULT_MOCK);
    });
  });
});
