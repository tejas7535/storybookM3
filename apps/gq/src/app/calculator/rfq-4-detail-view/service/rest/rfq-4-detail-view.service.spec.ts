import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models';
import { FileService } from '@gq/shared/services/rest/file/file.service';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK } from '../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { Rfq4DetailViewService } from './rfq-4-detail-view.service';
import { DetailViewPaths } from './rfq-4-detail-view-paths.enum';

describe('Rfq4DetailViewService', () => {
  let service: Rfq4DetailViewService;
  let spectator: SpectatorService<Rfq4DetailViewService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: Rfq4DetailViewService,
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      mockProvider(FileService),
    ],
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

  describe('assignRfq', () => {
    test('should call get with correct URL', () => {
      service.assignRfq(123).subscribe();
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/123/${DetailViewPaths.PATH_CLAIM_CALCULATION}`
      );

      expect(req.request.method).toBe('POST');
    });
  });

  describe('saveRfq4CalculationData', () => {
    test('should call post with correct url and request body', () => {
      service
        .saveRfq4CalculationData(123, RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK)
        .subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/123/${DetailViewPaths.PATH_RFQ4_RECALCULATE_DETAIL_VIEW_SAVE}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK);
    });
  });

  describe('confirmRfq4CalculationData', () => {
    test('should call post with correct url and request body', () => {
      service
        .confirmRfq4CalculationData(123, RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK)
        .subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/123/${DetailViewPaths.PATH_RFQ4_RECALCULATE_DETAIL_VIEW_CONFIRM}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK);
    });
  });
});
