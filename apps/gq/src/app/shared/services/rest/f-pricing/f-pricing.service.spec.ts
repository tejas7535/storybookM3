import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { FPricingService } from './f-pricing.service';

describe('FPricingService', () => {
  let spectator: SpectatorService<FPricingService>;
  let service: FPricingService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: FPricingService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFPricingData', () => {
    test('should call GET', () => {
      const gqPositionId = '1234';
      service
        .getFPricingData(gqPositionId)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/quotation-details/${gqPositionId}/f-pricing`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(gqPositionId);
    });
  });
});
