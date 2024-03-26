import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from '@hc/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { InternalUserCheckService } from './internal-user-check.service';

describe('InternalUserCheckService', () => {
  let spectator: SpectatorService<InternalUserCheckService>;
  let service: InternalUserCheckService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: InternalUserCheckService,
    imports: [HttpClientTestingModule],
    providers: [InternalUserCheckService],
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
