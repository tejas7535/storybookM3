import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../../../environments/environment';
import {
  BEARING_SEARCH_RESULT_MOCK,
  CALCULATION_PARAMETERS_MOCK,
  CALCULATION_RESULT_MOCK,
} from './../../../../testing/mocks/rest.service.mock';
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

  describe('#postGreaseCalculation', () => {
    it('should send a calculation post request with given params', (done) => {
      service
        .postGreaseCalculation(CALCULATION_PARAMETERS_MOCK)
        .subscribe((result: string) => {
          expect(result).toEqual(CALCULATION_RESULT_MOCK);
          done();
        });

      const req = httpMock.expectOne(`${environment.baseUrl}/calculate`);
      expect(req.request.method).toBe('POST');
      req.flush(CALCULATION_RESULT_MOCK);
    });
  });
});
