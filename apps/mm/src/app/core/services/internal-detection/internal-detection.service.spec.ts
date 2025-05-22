import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { environment } from '@mm/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { InternalDetectionService } from './internal-detection.service';

describe('InternalDetectionService', () => {
  let spectator: SpectatorService<InternalDetectionService>;
  let service: InternalDetectionService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: InternalDetectionService,
    imports: [],
    providers: [
      InternalDetectionService,
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
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
    it('should return true on 409 error', (done) => {
      service.getInternalHelloEndpoint().subscribe((result: boolean) => {
        expect(result).toBe(true);
        done();
      });

      const req = httpMock.expectOne(environment.internalDetectionUrl);
      expect(req.request.method).toBe('GET');
      req.flush('some error', { status: 409, statusText: 'Conflict' });
    });

    it('should return false on other errors', (done) => {
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
