import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { Rfq4DetailViewService } from './rfq-4-detail-view.service';
import { DetailViewPaths } from './rfq-4-detail-view-paths.enum';

describe('Rfq4DetailViewService', () => {
  let service: Rfq4DetailViewService;
  let spectator: SpectatorService<Rfq4DetailViewService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: Rfq4DetailViewService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getRfq4DetailViewData', () => {
    test('should call get with correct URL', () => {
      service.getRfq4DetailViewData('123').subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/123/${DetailViewPaths.PATH_RFQ_4_DETAIL_VIEW}`
      );
      expect(req.request.method).toBe('GET');
    });
  });
});
