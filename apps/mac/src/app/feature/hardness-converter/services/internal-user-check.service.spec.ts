import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { environment } from '@mac/environments/environment';

import { InternalUserCheckService } from './internal-user-check.service';

describe('InternalUserCheckService', () => {
  let spectator: SpectatorService<InternalUserCheckService>;
  let service: InternalUserCheckService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: InternalUserCheckService,
    imports: [HttpClientTestingModule],
    providers: [
      InternalUserCheckService,
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(InternalUserCheckService);
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isInternalUser', () => {
    it('should fetch the file', (done) => {
      service.isInternalUser().subscribe((result) => {
        expect(result).toBeTruthy();
        done();
      });

      const req = httpMock.expectOne(environment.internalUserCheckURL);
      expect(req.request.method).toBe('GET');
      req.flush('something');
    });
  });
});
