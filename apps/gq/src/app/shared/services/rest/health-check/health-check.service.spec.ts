import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { ApiVersion } from '../../../models';
import { HealthCheckService } from './health-check.service';

describe('HealthCheckService', () => {
  let httpMock: HttpTestingController;
  let spectator: SpectatorService<HealthCheckService>;
  let service: HealthCheckService;

  const createService = createServiceFactory({
    service: HealthCheckService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('pingHealthCheck', () => {
    test('should call', () => {
      service.pingHealthCheck().subscribe((res) => expect(res).toEqual({}));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service['PATH_HEALTH_CHECK']}`
      );
      expect(req.request.method).toBe('GET');
    });
  });
});
