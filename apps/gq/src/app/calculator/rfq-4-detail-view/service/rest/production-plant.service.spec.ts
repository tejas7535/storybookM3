import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { DetailViewPaths } from '@gq/calculator/rfq-4-detail-view/service/rest/rfq-4-detail-view-paths.enum';
import { ApiVersion } from '@gq/shared/models';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ProductionPlantService } from './production-plant.service';

describe('ProductionPlantService', () => {
  let service: ProductionPlantService;
  let spectator: SpectatorService<ProductionPlantService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: ProductionPlantService,
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProductionPlantsForRfq', () => {
    test('should call production plant url', () => {
      service.getProductionPlantsForRfq().subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/${DetailViewPaths.PATH_PRODUCTION_PLANTS}`
      );
      expect(req.request.method).toBe('GET');
    });
  });
});
