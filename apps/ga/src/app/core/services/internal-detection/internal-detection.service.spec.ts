import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '@ga/environments/environment';

import { InternalDetectionService } from './internal-detection.service';

describe('InternalDetectionService', () => {
  let spectator: SpectatorService<InternalDetectionService>;
  let service: InternalDetectionService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: InternalDetectionService,
    imports: [HttpClientTestingModule],
    providers: [InternalDetectionService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(InternalDetectionService);
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getInternalHelloEndpoint', () => {
    it('should return true on positive response', (done) => {
      service.getInternalHelloEndpoint().subscribe((result: boolean) => {
        expect(result).toBe(true);
        done();
      });

      const req = httpMock.expectOne(environment.internalDetectionUrl);
      expect(req.request.method).toBe('GET');
      req.flush('successful response');
    });

    it('should return false on error', (done) => {
      service.getInternalHelloEndpoint().subscribe((result: boolean) => {
        expect(result).toBe(false);
        done();
      });

      const req = httpMock.expectOne(environment.internalDetectionUrl);
      expect(req.request.method).toBe('GET');
      req.flush('some error', { status: 408, statusText: 'Request Timeout' });
    });
  });
});
