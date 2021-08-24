import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BEARING_SEARCH_RESULT_MOCK } from './../../../../testing/mocks/rest.service.mock';
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
        `${service['baseUrl']}/bearings/search?pattern=theQuery`
      );
      expect(req.request.method).toBe('GET');
      req.flush(BEARING_SEARCH_RESULT_MOCK);
    });
  });
});
